#!/usr/bin/env python
# -*- coding: utf-8 -*-
from mrjob.job import MRJob
import tempfile
from collections import defaultdict
import csv
import os


# Set tmp dir to relative directory from script
basepath = os.path.dirname(__file__)
tmp_dir  = os.path.abspath(os.path.join(basepath, "mrjob_tmp"))
tempfile.tempdir = tmp_dir


class AggregatorJob(MRJob):
    """
    Obtains children count for CUI1 from relations in the form `CUI1 child CUI2`
    Output format: (CUI1, number)
    """

    def mapper(self, _, line):
        split = line.split("\t")

        # MRREL header
        if len(split) == 3:
            (CUI1, relation, CUI2) = split

            if relation == "child":
                yield CUI1, 1


    def reducer(self, CUI1, counts):
        print "\t".join([CUI1, str(sum(counts))])


if __name__ == "__main__":
    AggregatorJob.run()