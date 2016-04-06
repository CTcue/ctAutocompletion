
def get_source_terms():
    from source_preprocessing import source_processing as sp
    sp.terms_to_file_sources()

if __name__ == '__main__':
    get_source_terms()