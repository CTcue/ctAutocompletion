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
    def mapper(self, _, line):
        split = line.split("\t")

        if len(split) == 6:
            (CUI, LAT, source, types, pref, terms) = split

            if len(terms.split("|")) == 1:
                yield CUI, [1, pref]


    def reducer(self, CUI, values):
        pref = ""
        count = 0

        for (_, term) in values:
            count += 1
            pref   = term


        if count == 1:
            out = "\t".join([CUI, pref])
            print out.encode("utf-8")


if __name__ == "__main__":
    AggregatorJob.run()