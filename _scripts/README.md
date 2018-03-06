Scripts
=======

Generate, process and UMLS concepts into Elasticsearch.


## Building from scratch

If you don't have a copy of the `output` directory, you can generate the `processed` files yourself too!



#### Downloading UMLS sources

* Login and get accepted for an NLM account
* Download the UMLS Full Release Files [download link](https://www.nlm.nih.gov/research/umls/licensedcontent/umlsknowledgesources.html)
* It contains the following, but the actual contents are in the `mmsys.zip` folder.

```
2015AA.CHK
2015AA.MD5
2015AA-1-meta.nlm
2015AA-2-meta.nlm
2015AA-otherks.nlm
mmsys.zip
Copyright_Notice.txt
README.txt
```

* Steps to obtain the UMLS .RRF files (they are like csv's)
    1. Extract the contents of `mmsys.zip` into `~/UMLS`
    2. Now also move the `mmsis.zip` into `~/UMLS` directory (so the hash can be verified)
    3. Go into the `~/UMLS` directory and run `./run_linux.sh` or `./run.bat`
        - If it gives an error like cannot run `C:\Program`, then update the script to include the correct JAVA_HOME path
    4. MetamorphoSys opens
    5. From the header menu, under "File" choose "Validate Distribution"
    6. In the application choose "Install UMLS"
    7. Choose "Active Subset" (Include only active UMLS sources)
    8. Then, pick the default options given
    9. In the header menu of the configuration, choose "Done"

* You can now get some coffee, it will take ~45 minutes.


#### JAVA_HOME with quotes (Windows) working

```
REM Specify CLASSPATH
set CLASSPATH=.;lib\jpf-boot.jar

"%JAVA_HOME%\bin\java" -Dfile.encoding=UTF-8 ^
 -Xms1000M -Xmx2000M  ^
 -Dswing.defaultlaf=com.sun.java.swing.plaf.windows.WindowsLookAndFeel ^
 -Dscript_type=.bat  ^
 org.java.plugin.boot.Boot
```



#### Building

* If you extracted all *.RRF files, then copy the `./[YEAR-AA]/META/` directory (it should at least contain MRCONSO.RRF and MRSTY.RRF)
* Adjust the `./generate.sh` script so all paths are correct (for example `./2015AA/META/*.RRF`)
* Run `generate.sh` to process UMLS and create the `./output` files

> This will take quite some time


## Output

* The `./output` directory contains:
    * `./output/concepts.txt` is a copy of MRCONSO + additional sources in combination with a type from MRSTY.
    * `./output/relations.txt` contains (useful) relations extracted from MRREL.

* `./additional_terms` contains extracted concepts from farmacompas (mapped_farmaco.csv).
* You can also put your own .csv file with concepts in there. It uses the following format:

```
CUI      | Name       | Language | Source       | PREF? | STY  |
---------|------------|----------|--------------|-------|------|
C0054836 | Carvedilol | DUT      | farma_compas | Y     |T200  |

```
