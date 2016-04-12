from relations.get_UMLS_relations import extract_rels
import argparse
import os

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description="ctAutocompletion upload script")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    args = parser.parse_args()

    umls_dir = args.dir

    # Check if used_cuis is available
    CUI_file = "relations/data/used_CUIs.csv"
    if not os.path.isfile(CUI_file) or os.stat(CUI_file).st_size == 0:
        print "used_CUIs is not available or empty, running CUI extraction from bulk upload first."
        from bulk_upload import record_CUIs
        record_CUIs(umls_dir)

    extract_rels(umls_dir)