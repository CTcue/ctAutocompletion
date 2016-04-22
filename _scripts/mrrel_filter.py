# syns_aggregator_job.py
from mrjob.job import MRJob

class SynsAggregatorJob(MRJob):
    """
    Groups unique synonyms by CUI.
    Output format: (CUI, [STR, STR, ...])
    """

    def mapper(self, key, value):
        (
            CUI1,
            AUI1,
            STYPE1,
            REL,
            CUI2,
            AUI2,
            STYPE2,
            RELA,
            RUI,
            SRUI,
            SAB,
            SL,
            RG,
            DIR,
            SUPPRESS,
            CVF,
            _
        ) = value.split("|")

        yield CUI, STR


    def reducer(self, key, values):
        uniqSyns = set()
        for value in values:
            uniqSyns.add(value)

        print "%s\t%s" % (key, list(uniqSyns))

if __name__ == "__main__":
    SynsAggregatorJob.run()