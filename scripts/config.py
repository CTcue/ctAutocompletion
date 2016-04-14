add_termfiles = ["snomed",
                "loinc",
                "customctcue",
                "mesh"
                ]

add_termfiles = ["additional_terms/mapped_"+atf+"_terms.csv" for atf in add_termfiles]

# sources = {"GGL_translate":(""),"LOINC","snomed_NL", "DHD"***REMOVED***

MeSH_files = {
    "NL_file1"      : "/Users/CTcue/ctcue_code/data/mesh_NTvG/MH2007_vertaling.csv",
    "NL_file2"      : "/Users/CTcue/ctcue_code/data/mesh_NTvG/PE2007_vertaling.csv"
***REMOVED***

DHD_files = {
    "terms"         : "/Users/CTcue/ctcue_code/data/DHD_formaat3_20160322/20160322_114428_versie3.0_ThesaurusTerm.csv",
    "concepts"      : "/Users/CTcue/ctcue_code/data/DHD_formaat3_20160322/20160322_114428_versie3.0_ThesaurusConcept.csv"
***REMOVED***

snomed_NL_files = {
    "terms"         : "/Users/CTcue/ctcue_code/data/snomed_NL/NL_Extension/Full/Terminology/sct2_Description_Full_NL_20150331.txt"
***REMOVED***

GGL_translate_files = {
    "term_file"     :"/Users/CTcue/ctcue_code/data/google_translate_snomed/google_translated_terms_with_ids.csv"
***REMOVED***

LOINC_files = {
    "NL_file"       :"/Users/ctcue/ctcue_code/data/mapping_LOINC_snomed/mapping_files/LOINC_NL.csv",
    "EN_file"       :"/Users/ctcue/ctcue_code/data/mapping_LOINC_snomed/LOINC_252/loinc.csv"
***REMOVED***
