from itertools import izip
import unicodecsv as csv
import re
import math
import os


def read_rrf(filename, header, wanted, delimiter="|"):
    with open(filename, "rb") as f:
        datareader = csv.reader(f, encoding="utf-8", delimiter=str(delimiter))
        first = next(datareader)
        tmp = dict(zip(header, first))
        row = { k: tmp[k] for k in wanted }

        cui = tmp['CUI']
        group = [row]

        for line in datareader:
            tmp = dict(zip(header, line))
            row = { k: tmp[k] for k in wanted }

            if cui == tmp['CUI']:
                group.append(row)
            else:
                yield (cui, group)

                # reset
                cui = tmp['CUI']
                group = [row]


def read_conso(umls_dir):
    header = [
        "CUI",
        "LAT",
        "TS",
        "LUI",
        "STT",
        "SUI",
        "ISPREF",
        "AUI",
        "SAUI",
        "SCUI",
        "SDUI",
        "SAB",
        "TTY",
        "CODE",
        "STR",
        "SRL",
        "SUPPRESS ",
        "CVF"
    ]

    wanted = ["LAT", "SAB", "STT", "TS", "ISPREF", "TTY", "STR"]

    filename = os.path.join(umls_dir, "MRCONSO.RRF")
    for cui, group in read_rrf(filename, header, wanted):
        filtered = []
        types = []
        preferred = None

        for g in group:
            # Get first "english preferred" term available
            if not preferred and g["TS"] == "P" and g["LAT"] == "ENG":
                preferred = g["STR"]

            if check_row(g):
                row = { k: g[k] for k in wanted }
                row["normal"] = normalize(row["STR"])
                filtered.append(row)

            # Extract category indicators (the FN terms usually have one)
            if g["TTY"] == "FN":
                match = re.search(_combined, g["STR"])
                if match and match.groups():
                    types.append(match.groups()[0].strip(" [()]"))

        yield (cui, filtered, types, preferred)


def read_sty(umls_dir):
    header = [
        "CUI",
        "TUI",
        "STN",
        "STY",
        "ATUI",
        "CVF"
    ]

    wanted = ["STY"]

    filename = os.path.join(umls_dir, "MRSTY.RRF")
    for cui, group in read_rrf(filename, header, wanted):
        filtered = [g["STY"] for g in group]
        yield (cui, filtered)


def merged_rows(umls_dir):
    return izip(read_conso(umls_dir), read_sty(umls_dir))


_digits = re.compile('\d')

bracket_cat = [
    "activity",
    "acute",
    "acuut",
    "all forms",
    "antepartum",
    "body structure",
    "cell",
    "commercial",
    "device",
    "diagnosis",
    "disorder",
    "etiology",
    "event",
    "finding",
    "function",
    "fungus",
    "history",
    "mass",
    "massa",
    "medication",
    "observable entity",
    "occupation",
    "organism",
    "physical finding",
    "physical force",
    "procedure",
    "product",
    "qualifier value"
    "situation",
    "structure",
    "substance",
    "symptom",
    "treatment",
    "volume",
]
_cats = re.compile( "\((%s)\)" % "|".join(bracket_cat) )

block_cat = [
    "ambiguous",
    "Chemical/Ingredient",
    "Disease/Finding"
]

_combined = re.compile("(\[(%s)\]|\((%s)\))" % ("|".join(block_cat), "|".join(bracket_cat)))

endsWith = [
    "NAO",
    "\(NAO\)",
    "\(NOS\)",
    "nao",
    "[Dd]is",
    "[Zz]iekte van",
    "[Ss]yndroom van",
    "unspecified"
]
_endings = re.compile(" (%s)$" % "|".join(endsWith))

def contains_digits(d):
    return bool(_digits.search(d))


def get_term(row):
    return normalize(row['STR'])


def check_row(row):
    languages = ['ENG', 'DUT']

    obsolete = [
        'N1',
        'OAS',
        'OAF',
        'OAM',
        'OAP',
        'OA',
        'OCD',
        'OET',
        'OF',
        'OLC',
        'OM',
        'ONP',
        'OOSN',
        'OPN',
        'OP',
        'LO',
        'IS',
        'MTH_LO',
        'MTH_IS',
        'MTH_OET'
    ]

    crazy_sources = [
        "CHV",
        "PSY",
        "ICD9",
        "ICD9CM",
        "NCI_FDA",
        "NCI_CTCAE",
        "NCI_CDISC",
        "ICPC2P",
        "SNOMEDCT_VET"
    ]

    # Skip records that are too long, have Pat.mo.dnt things in it or aren't prefered/obsolete
    return len(row['STR']) < 32 and \
        row['STR'].count(".") < 3 and \
        row['STR'].count(":") < 3 and \
        not re.search(r"(nos|NOS)$", row['STR']) and \
        row['ISPREF'] == 'Y' and \
        row['LAT'] in languages and \
        row['TTY'] not in ["PM"] and \
        row['TTY'] not in obsolete and \
        row['SAB'] not in crazy_sources


def can_skip_cat(sty):
    skip_categories = [
        "Age Group",
        "Temporal Concept",
        "Organism Attribute",
        "Intellectual Product",
        "Food",
        "Plant",
        "Mammal",
        "Geographic Area",
        "Governmental or Regulatory Activity",
        "Health Care Related Organization",
        "Organization",
        "Patient or Disabled Group",
        "Population Group",
        "Qualitative Concept",
        "Quantitative Concept",
        "Regulation or Law",
        "Self-help or Relief Organization",
    ]

    return any((x for x in sty if x in skip_categories))


# Get patterns that can be replaced, to get spelling variation people use
# ie. Sjogren's disease -> Sjogrens
# Adjusted from ontologies/link_abbreviations_SNOMED.py

def patterns_replacement():
    patterns = []
    patterns.append(("\s*ziekte(\s+van)?",""))
    patterns.append(("\s*syndroom(\s+van)?",""))
    patterns.append(("disease(\s+of)?",""))
    patterns.append(("syndrom(\s+of)?",""))

    return patterns


def normalize(term):
    term = term.replace(";", " ")
    term = term.replace("^+^", "+")

    term = re.sub(r"-+", "-", term)
    term = re.sub(r"(<su[bp])?>([a-zA-Z0-9]+)<(/su[bp]>)?", r"\2", term)
    term = re.sub(_cats, "", term)

    # Clean between brackets
    term = re.sub("(\[[a-zA-Z\/]+\])", "", term)

    # Remove specific terms at term endings
    term = re.sub(_endings, "", term)

    # Reduce multiple spaces to single
    term = re.sub('\s+', ' ', term)

    # If entire term is uppercased, skip checking for abbreviations
    if term.isupper():
        term = term.lower()
    else:
        # Some terms contain their own abbreviation
        # i.e. AS - Ankylosing spondylitis
        if re.match(r"[A-Z]{1,6} - .*", term, flags=re.U):
            split = term.split(" - ", 1)
            term = split[1]

    # Skip things with digits, probably a scienctific notation
    if contains_digits(term):
        return term.strip()

    # Using "PF preferred terms" most machine variants
    # (i.e. First last is notated as Last, First)
    # However, the dutch terms are all labeled as PF?

    term, n = re.subn(r"(\w+), ([a-zA-Z- ]+)-$", r"\2\1", term, flags=re.U)

    # If replacements made, also lowercase it or you get Tumor, Buik- => BuikTumor
    if n > 0:
        term = term.lower()

    return term.strip(" ,-")


def unique_terms(seq, key):
    seen = set()
    return [x for x in seq if x[key].lower() not in seen and not seen.add(x[key].lower())]


TTY_mapping = {
    "AA": "Attribute type abbreviation",
    "AB": "Abbreviation in any source vocabulary",
    "ACR": "Acronym",
    "AC": "Activities",
    "AD": "Adjective",
    "AM": "Short form of modifier",
    "AS": "Attribute type synonym",
    "AT": "Attribute type",
    "AUN": "Authority name",
    "BD": "Fully-specified drug brand name that can be prescribed",
    "BN": "Fully-specified drug brand name that can not be prescribed",
    "BPCK": "Branded Drug Delivery Device",
    "BR": "Binding realm",
    "CA": "2 ISO 3166-1 standard country code in alpha-2 (two-letter) format",
    "CA": "3 ISO 3166-1 standard country code in alpha-3 (three-letter) format",
    "CCN": "Chemical code name",
    "CCS": "FIPS 10-4 country code",
    "CC": "Trimmed ICPC component process",
    "CDA": "Clinical drug name in abbreviated format",
    "CDC": "Clinical drug name in concatenated format (NDDF), Clinical drug name (NDFRT)",
    "CDD": "Clinical drug name in delimited format",
    "CDO": "Concept domain",
    "CD": "Clinical Drug",
    "CE": "Entry term for a Supplementary Concept",
    "CHN": "Chemical structure name",
    "CL": "Class",
    "CMN": "Common name",
    "CN": "LOINC official component name",
    "CO": "Component name (these are hierarchical terms, as opposed to the LOINC component names which are analytes)",
    "CPR": "Concept property",
    "CP": "ICPC component process (in original form)",
    "CR": "Concept relationship",
    "CSN": "Chemical Structure Name",
    "CSY": "Code system",
    "CS": "Short component process in ICPC, i.e. include some abbreviations",
    "CU": "Common usage",
    "CV": "Content view",
    "CX": "Component, with abbreviations expanded.",
    "DEV": "Descriptor entry version",
    "DE": "Descriptor",
    "DFG": "Dose Form Group",
    "DF": "Dose Form",
    "DI": "Disease name",
    "DN": "Display Name",
    "DO": "Domain",
    "DP": "Drug Product",
    "DSV": "Descriptor sort version",
    "DS": "Short form of descriptor",
    "DT": "Definitional term, present in the Metathesaurus because of its connection to a Dorland's definition or to a definition created especially for the Metathesaurus",
    "EN": "Non-print entry term",
    "EP": "Print entry term",
    "EQ": "Equivalent name",
    "ES": "Short form of entry term",
    "ETAV": "Entry Term Allelic Variant",
    "ETCF": "Entry term, consumer friendly description",
    "ETCLIN": "Entry term, clinician description",
    "ET": "Entry term",
    "EX": "Expanded form of entry term",
    "FBD": "Foreign brand name",
    "FI": "Finding name",
    "FN": "Full form of descriptor",
    "GN": "Generic drug name",
    "GO": "Goal",
    "GPCK": "Generic Drug Delivery Device",
    "GT": "Glossary term",
    "HC": "Hierarchical class",
    "HD": "Hierarchical descriptor",
    "HGJKN1": "Japanese High Level Group Term (kana1)",
    "HGJKN": "Japanese High Level Group Term (kana)",
    "HG": "High Level Group Term",
    "HS": "Short or alternate version of hierarchical term",
    "HTJKN1": "Japanese Hierarchical term (kana1)",
    "HTJKN": "Japanese Hierarchical term (kana)",
    "HTN": "HL7 Table Name",
    "HT": "Hierarchical term",
    "HX": "Expanded version of short hierarchical term",
    "ID": "Nursing indicator",
    "IN": "Name for an ingredient",
    "IS": "Obsolete Synonym",
    "IT": "Index term",
    "IVC": "Intervention categories",
    "IV": "Intervention",
    "LA": "LOINC answer",
    "LC": "Long common name",
    "LN": "LOINC official fully specified name",
    "LO": "Obsolete official fully specified name",
    "LPDN": "LOINC parts display name",
    "LPN": "LOINC parts name",
    "LS": "Expanded system/sample type (The expanded version was created for the Metathesaurus and includes the full name of some abbreviations.)",
    "LTJKN": "1  Japanese Lower Level Term (kana1)",
    "LTJKN": "Japanese Lower Level Term (kana)",
    "LT": "Lower Level Term",
    "LV": "Lexical variant",
    "MD": "CCS multi-level diagnosis categories",
    "MH": "Main heading",
    "MIN": "name for a multi-ingredient",
    "MP": "Preferred names of modifiers",
    "MS": "Multum names of branded and generic supplies or supplements",
    "MTH_AB": "MTH abbreviation",
    "MTH_ACR": "MTH acronym",
    "MTH_BD": "MTH fully-specified drug brand name that can be prescribed",
    "MTH_CHN": "MTH chemical structure name",
    "MTH_CN": "MTH Component, with abbreviations expanded.",
    "MTH_ET": "Metathesaurus entry term",
    "MTH_FN": "MTH Full form of descriptor",
    "MTH_HG": "MTH High Level Group Term",
    "MTH_HT": "MTH Hierarchical term",
    "MTH_HX": "MTH Hierarchical term expanded",
    "MTH_ID": "Metathesaurus expanded form of nursing indicator",
    "MTH_IS": "Metathesaurus-supplied form of obsolete synonym",
    "MTH_LN": "MTH Official fully specified name with expanded abbreviations",
    "MTH_LO": "MTH Expanded LOINC obsolete fully specified name",
    "MTH_LT": "MTH Lower Level Term",
    "MTH_LV": "MTH lexical variant",
    "MTH_OAF": "Metathesaurus-supplied form of obsolete active fully specified name",
    "MTH_OAP": "Metathesaurus-supplied form of obsolete active preferred term",
    "MTH_OAS": "Metathesaurus-supplied form of obsolete active synonym",
    "MTH_OET": "Metathesaurus obsolete entry term",
    "MTH_OF": "Metathesaurus-supplied form of obsolete fully specified name",
    "MTH_OL": "MTH Non-current Lower Level Term",
    "MTH_OPN": "Metathesaurus obsolete preferred term, natural language form",
    "MTH_OP": "Metathesaurus obsolete preferred term",
    "MTH_OS": "MTH System-organ class",
    "MTH_PTGB": "Metathesaurus-supplied form of British preferred term",
    "MTH_PTN": "Metathesaurus preferred term, natural language form",
    "MTH_PT": "Metathesaurus preferred term",
    "MTH_RXN_BD": "RxNorm Created BD",
    "MTH_RXN_CDC": "RxNorm Created CDC",
    "MTH_RXN_CD": "RxNorm Created CD",
    "MTH_RXN_DP": "RxNorm Created DP",
    "MTH_RXN_RHT": "RxNorm Created reference hierarchy term",
    "MTH_SI": "MTH Sign or symptom of",
    "MTH_SMQ": "Metathesaurus version of Standardised MedDRA Query",
    "MTH_SYGB": "Metathesaurus-supplied form of British synonym",
    "MTH_SY": "MTH Designated synonym",
    "MV": "Multi-level procedure category",
    "N1": "Chemical Abstracts Service Type 1 name of a chemical",
    "NA": "Name aliases",
    "NM": "Name of Supplementary Concept",
    "NPT": "HL7 non-preferred for language term",
    "NP": "Non-preferred term",
    "NS": "Short form of non-preferred term",
    "NX": "Expanded form of non-preferred term",
    "OAF": "Obsolete active fully specified name",
    "OAM": "Obsolete Modifier Abbreviation",
    "OAP": "Obsolete active preferred term",
    "OAS": "Obsolete active synonym",
    "OA": "Obsolete abbreviation",
    "OCD": "Obsolete clinical drug",
    "OC": "Nursing outcomes",
    "OET": "Obsolete entry term",
    "OF": "Obsolete fully specified name",
    "OLC": "Obsolete Long common name",
    "OLJKN1": "Japanese Non-current Lower Level Term (kana1)",
    "OLJKN": "Japanese Non-current Lower Level Term (kana)",
    "OL": "Non-current Lower Level Term",
    "OM": "Obsolete modifiers in HCPCS",
    "ONP": "Obsolete non-preferred for language term",
    "OOSN": "Obsolete official short name",
    "OPN": "Obsolete preferred term, natural language form",
    "OP": "Obsolete preferred name",
    "OR": "Orders",
    "OSJKN1": "Japanese System-organ class in the WHO Adverse Reaction Terminology (kana1)",
    "OSJKN": "Japanese System-organ class in the WHO Adverse Reaction Terminology (kana)",
    "OSN": "Official short name",
    "OS": "System-organ class",
    "PCE": "Preferred entry term for Supplementary Concept",
    "PC": "Preferred trimmed term in ICPC",
    "PEN": "Preferred non-print entry term",
    "PEP": "Preferred entry term",
    "PIN": "Name from a precise ingredient",
    "PM": "Machine permutation",
    "PN": "Metathesaurus preferred name",
    "PQ": "Qualifier for a problem",
    "PR": "Name of a problem",
    "PSC": "Protocol selection criteria",
    "PSN": "Prescribable Names",
    "PS": "Short forms that needed full specification",
    "PTAV": "Preferred Allelic Variant",
    "PTCS": "Preferred Clinical Synopsis",
    "PTGB": "British preferred term",
    "PTJKN1": "Japanese Designated preferred name (kana1)",
    "PTJKN": "Japanese Designated preferred name (kana)",
    "PTN": "Preferred term, natural language form",
    "PT": "Designated preferred name",
    "PXQ": "Preferred qualifier term",
    "PX": "Expanded preferred terms (pair with PS)",
    "QAB": "Qualifier abbreviation",
    "QEV": "Qualifier entry version",
    "QSV": "Qualifier sort version",
    "RAB": "Root abbreviation",
    "RHT": "Root hierarchical term",
    "RPT": "Root preferred term",
    "RSY": "Root synonym",
    "RS": "Extracted related names in SNOMED2",
    "RT": "Term that is related to, but often considered non-synonymous with, the preferred term",
    "RXN_IN": "Rxnorm Preferred Ingredient",
    "RXN_PT": "Rxnorm Preferred",
    "SBDC": "Semantic Branded Drug Component",
    "SBDF": "Semantic branded drug and form",
    "SBDG": "Semantic branded drug group",
    "SBD": "Semantic branded drug",
    "SB": "Named subset of a source",
    "SCALE": "Scale",
    "SCDC": "Semantic Drug Component",
    "SCDF": "Semantic clinical drug and form",
    "SCDG": "Semantic clinical drug group",
    "SCD": "Semantic Clinical Drug",
    "SCN": "Scientific name",
    "SC": "Special Category term",
    "SD": "CCS single-level diagnosis categories",
    "SI": "Name of a sign or symptom of a problem",
    "SMQ": "Standardised MedDRA Query",
    "SP": "CCS single-level procedure categories",
    "SSN": "Source short name, used in the UMLS Knowledge Source Server",
    "SS": "Synonymous short forms",
    "ST": "Step",
    "SU": "Active Substance",
    "SX": "Mixed-case component synonym with expanded abbreviations",
    "SYGB": "British synonym",
    "SYN": "Designated alias",
    "SY": "Designated synonym",
    "TA": "Task",
    "TC": "Term class",
    "TG": "Name of the target of an intervention",
    "TMSY": "Tall Man synonym",
    "TQ": "Topical qualifier",
    "TX": "CCPSS synthesized problems for TC termgroup",
    "UAUN": "Unique authority name",
    "UCN": "Unique common name",
    "USN": "Unique scientific name",
    "USY": "Unique synonym",
    "VAB": "Versioned abbreviation",
    "VPT": "Versioned preferred term",
    "VSY": "Versioned synonym",
    "VS": "Value Set",
    "XD": "Expanded descriptor in AOD",
    "XM": "Cross mapping set",
    "XQ": "Alternate name for a qualifier"
}

def lookup(abbr):
    try:
        return TTY_mapping[abbr]
    except:
        return "UNKNOWN"