from relations.get_UMLS_relations import extract_rels
import argparse
import os

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description="ctAutocompletion upload script")
    parser.add_argument('--dir', dest='dir', required=True, help='Directory containing the *.RRF files from UMLS')
    args = parser.parse_args()

    umls_dir = args.dir

    # Check if used_cuis is available
    if not os.path.isfile("relations/data/used_CUIs.csv"):
        print "used_CUIs is not available, running CUI extraction from bulk upload first."
        from bulk_upload import record_CUIs
        record_CUIs(umls_dir)

    extract_rels(umls_dir)