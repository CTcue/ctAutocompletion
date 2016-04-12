import os
import config

output_folder = "source_processing/data"
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

params = {}

params["MeSH"]=config.MeSH_files

DHD_params = {
    "NL_file"       :config.DHD_files["terms"],
    "mapping_file"  :config.DHD_files["concepts"],
    "snomed_id"     :"SnomedID",
    "source_id"     :"ConceptID",
    "term"          :"Omschrijving",
}
params["DHD"]=DHD_params

snomed_NL_params = {
    "NL_file"       :config.snomed_NL_files["terms"],
    "snomed_id"     :"conceptId",
    "term"          :"term",
    "lan"           :"languageCode",
    "lan_nl"        :"nl",
}
params["snomed_NL"]=snomed_NL_params


params["GGL_translate"]=config.GGL_translate_files


LOINC_params = {
     #path to file with dutch terms linked to source ids
    "NL_file"       :config.LOINC_files["NL_file"],
    # path to file with english terms linked to source ids
    "EN_file"       :config.LOINC_files["EN_file"],
    "NL_source_id"  :"LOINC_NUM",
    "NL_pref_term"  :"COMPONENT", #key to field of preferred term in NL_file
    "NL_synonyms"   :"", #key to field of additional terms in NL_file, empty string if there are none
    "EN_source_id"  :"LOINC_NUM",
    "EN_pref_term"  :"COMPONENT", #key to field of preferred term in NL_file
    "EN_synonyms"   :["CONSUMER_NAME","SHORTNAME"],

}
params["LOINC"]=LOINC_params
