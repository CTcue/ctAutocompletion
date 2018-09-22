Scripts
=======

Generate, process and add UMLS concepts into Elasticsearch.


**You don't have to do this probably** download the `concepts.txt` from zoomholding or check if someone has a recently processed file.


### Obtaining UMLS sources

If you don't have a copy of the `output` directory, you can generate the `processed` files yourself too!

* Login and get accepted for an NLM account
* Download the UMLS Full Release Files [download link](https://www.nlm.nih.gov/research/umls/licensedcontent/umlsknowledgesources.html)
    * So you get a zip named something like `umls-2018AA-full.zip`
* When the download completes, upzip it. It contains the following, but the actual contents are in the `mmsys.zip` folder.


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


* Steps to obtain the UMLS .RRF files (they are CSV files but using a `|` as a separator)
    1. Extract the contents of `mmsys.zip` into `~/UMLS`
    2. Now also move the `mmsis.zip` into `~/UMLS` directory (so the checksum can be verified). The UMLS directory should look something like:
    ```
        2018aa-1-meta.nlm
        2018aa-2-meta.nlm
        2018aa-otherks.nlm
        2018AA.CHK
        2018AA.MD5
        Autorun.inf
        boot.properties
        config/
        Copyright_Notice.txt
        etc/
        jre/
        lib/
        log4j.properties
        mmsys.zip              // Yep, the zip is also in here
        plugins/
        README.txt
        release.dat
        run_linux.sh*
        run_mac.command*
        run_mac.sh*
        run.bat
        run64.bat
    ```

    3. Go into the `~/UMLS` directory
        * Then you can activate `run_linux.sh` or `run.bat` or `run64.bat`
        * If it gives an error like cannot run `C:\Program\`, then update the script to include the correct `JAVA_HOME` path
        * An example script that worked on Windows:

        ```
            REM Specify CLASSPATH
            set CLASSPATH=.;lib\jpf-boot.jar

            "%JAVA_HOME%\bin\java" -Dfile.encoding=UTF-8 ^
            -Xms1000M -Xmx2000M  ^
            -Dswing.defaultlaf=com.sun.java.swing.plaf.windows.WindowsLookAndFeel ^
            -Dscript_type=.bat  ^
            org.java.plugin.boot.Boot
        ```

    4. MetamorphoSys opens when the script runs. **IMPORTANT:**
        * From the header menu, under "File" choose "Validate Distribution" (this validates the checksum)
        * Now, you can click the "Install UMLS" from the MetamorphoSys tool

    5. Follow these MetamorphoSys steps:
        * Pick a destination and check the UMLS knowledge sources
            * As a destination, it's easier if you pick `/ctAutocompletion/scripts/`
        * It will ask for a config file. So you have to select "new configuration"
            * Choose the active subset configuration (Note: Level_0 contains far less terms)
            * A window with input options, output options, a source list, precedence and suppressibility pops up
            * You can select non english/dutch sources in the "Source" list to exclude these
            * **Don't forget** to include the DUTCH sources
        * It now asks for a `.prop` file. Use the `props/level_0.prop` or `props/all.prop` for an instant configuration.

    6. In the header menu of the configuration, choose "Done" > "Start subset"
        * The extract will take quite some time (30 mins)


### Creating `concepts.txt`

* If the extract is completed, look for the `./[YEAR-AA]/META/` directory
    * Verify it has files with an `*.RRF` extension and check if MRCONSO.RRF and MRSTY.RRF exist


##### Clean up MRCONSO

There are lot's of terms in UMLS, but most aren't even diagnosis / medication / measurement names, but just random things. So we want to pre-process the file to reduce the amount of terms we have.

* First get the dependencies:

```
cd ctAutocompletion/scripts
pip install -r requirements.txt
```

* Run clean up script (either via CLI or via GUI). The clean up takes around ~2 minutes.

TODO: Input the MRCONSO, the MRSTY and then clean it
    -> load MRSTY in memory
    -> Loop over MRCONSO
        -> Lookup STY value
        -> Put in

```
// First argument is the MRCONSO path
// Second argument the output directory

python preprocess/cleanup.py --ignore-gooey -- "C:\Users\Fabien\ctcue\2018AA\META\MRCONSO.RRF" "C:\Users\Fabien\ctcue"
```

* **Lazy way** with a GUI

```
// Extra dependency for GUI creator
conda install wxpython

python preprocess/cleanup.py
```


#### Combining MRCONSO and MRSTY

* We want to join the 'search-terms' from MRCONSO with the 'search-category' of MRSTY for some additional clean up and

```
xsv join -d "|" 1 CLEAN_MRCONSO.RRF 1 MRSTY.RRF > merged.csv
```


#### Building

* If you extracted all *.RRF files, then copy the `./[YEAR-AA]/META/` directory (it should at least contain MRCONSO.RRF and MRSTY.RRF)
* Adjust the `./generate.sh` script so all paths are correct (for example `./2015AA/META/*.RRF`)
* Run `generate.sh` to process UMLS and create the `./output` files

> This will take quite some time


## Output

* The `./output` directory contains:
    * `./output/concepts.txt` is a copy of MRCONSO + additional sources in combination with a type from MRSTY.
    * `./output/relations.txt` contains (useful) relations extracted from MRREL (OPTIONAL as we don't use Neo4j anymore).

* `./additional_terms` contains extracted concepts from farmacompas (mapped_farmaco.csv).
* You can also put your own .csv file with concepts in there. It uses the following format:

```
CUI      | Name       | Language | Source       | PREF? | STY  |
---------|------------|----------|--------------|-------|------|
C0054836 | Carvedilol | DUT      | farma_compas | Y     |T200  |
```
