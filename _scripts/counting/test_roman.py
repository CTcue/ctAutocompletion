
import re

p_construct1 = re.compile(r"\b(skin|tissue) structure of\b", flags=re.I)
p_construct2 = re.compile(r"\b(fracture|structure) of\b.*of\b", flags=re.I)
# associated with

p_roman  = re.compile(r"\b(IX|IV|V?I{0,3***REMOVED***)\b")

print re.match(p_roman, "Hello II, stage")

# print re.search(p_construct1, "Skin structure of labium")
# print re.search(p_construct1, "Subcutaneous tissue structure of head")
# print re.search(p_construct2, "Structure of occipital angle")

# print len(re.findall(r'\w+', "Superficial foreign body of flank without major open wound AND without infection"))