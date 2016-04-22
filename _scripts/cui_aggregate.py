from mrjob.job import MRJob
from mrjob.step import MRStep


class SynsAggregatorJob(MRJob):
    """
    Groups unique synonyms by CUI.
    Output format: (CUI, [STR, STR, ...])
    """

    # def steps(self):
    #     return [
    #         MRStep(mapper=self.group_by_user_id),
    #         MRStep(reducer=self.join_events),
    #         MRStep(reducer=self.count_events),
    #     ]


    def mapper(self, key, value):
        # MRCONSO Header
        (CUI, LAT, TS, LUI, STT, SUI, ISPREF, AUI, SAUI, SCUI, SDUI, SAB, TTY, CODE, STR, SRL, SUPPRESS, CVF, _) = value.split("|")

        if len(STR) > 32:
            return

        if ISPREF != 'Y':
            return

        # Language
        if LAT not in ['ENG', 'DUT']:
            return

        # Obsolete sources
        if TTY in ['N1','PM', 'OAS','OAF','OAM','OAP','OA','OCD','OET','OF','OLC','OM','ONP','OOSN','OPN','OP','LO','IS','MTH_LO','MTH_IS','MTH_OET']:
            return

        if SAB in ["CHV","PSY","ICD9","ICD9CM","NCI_FDA","NCI_CTCAE","NCI_CDISC","ICPC2P","SNOMEDCT_VET"]:
            return

        # Skip records such as Pat.mo.dnt
        if STR.count(".") >= 3 or STR.count(":") >= 3:
            return

        yield CUI, STR


    def reducer(self, key, values):
        uniqSyns = set()
        for value in values:
            uniqSyns.add(value)

        print "%s\t%s" % (key, list(uniqSyns))



if __name__ == "__main__":
    SynsAggregatorJob.run()