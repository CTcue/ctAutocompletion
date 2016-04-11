from bulk_upload import upload
from source_processing.process_sources import get_source_terms
from source_processing.terms_processing import check_sources
import source_processing.umls_mappings as map_umls
import argparse


def process_terms_and_upload(umls_dir, index, add_termfiles):
    # get_source_terms()

    # check_sources("SNOMED")
    check_sources("MESH")
    # check_sources("LOINC")

    map_umls.umls_mesh_mappings(umls_dir)
    # map_umls.umls_snomed_mappings(umls_dir)
    # map_umls.umls_loinc_mappings(umls_dir)

    # upload(umls_dir, index, add_termfiles=add_termfiles)


if __name__ == '__main__':
    import config

    parser = argparse.ArgumentParser(description="ctAutocompletion upload script")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    parser.add_argument('--index', dest='index', default="autocomplete", help='Elasticsearch index for autocompletion')
    args = parser.parse_args()

    umls_dir = args.dir
    index = args.index

    add_termfiles = config.add_termfiles
    process_terms_and_upload(umls_dir, index, add_termfiles)