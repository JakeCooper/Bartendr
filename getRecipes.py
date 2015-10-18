import sys, os
import urllib
from lxml import html
from lxml.etree import tostring
import requests
from lxml.cssselect import CSSSelector
from HTMLParser import HTMLParser
import json

class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()


drinks = [];
for i in range(5510,6217):
    drink = {}
    if (i%100 == 0):
        print "checking drink "+ str(i)
    url ="http://www.webtender.com/db/drink/"+str(i)
    headers = {'user-agent': 'my-app/0.0.1'}
    page = requests.get(url,headers=headers)
    if (page.status_code == 200):
        tree = html.fromstring(page.text)
        source = tostring(tree)
        title_start = source.index("<h1>")
        title_end = source.index("</h1>")
        title = source[title_start+4:title_end-5]
        ing_start = source.index("Ingredients:")
        ing_end = source.index("Mixing instructions:")
        drink["name"]=title

        ing_list = source[ing_start:ing_end].split("\n")
        ings = [];
        for ing in ing_list:
            if (strip_tags(ing) != ""):
                ings.append(strip_tags(ing))

        ings.pop(0)
        drink["ingredients"] = ings

        rest_index = source.index('<div align="center"><br/><script type="text/javascript">&lt;!--');
        rest = source[ing_end+20:rest_index]
        if ("Creator/contributor's comments:" in source):
            comment_index = rest.index("Creator/contributor's comments:")
            comment = rest[comment_index + 31:rest_index]
            drink["instructions"] = strip_tags(source[ing_end+20:comment_index]).strip();
            drink["comment"] = strip_tags(comment).strip();
        else:
            drink["instructions"] = strip_tags(rest).strip();


        request_url = "https://bartendr.herokuapp.com/api/add-drink?"
        encoded_params = urllib.urlencode(drink);

        request_url = request_url + encoded_params
        #r=requests.get(request_url)
        #print r.status_code
        #print request_url
        drinks.append(drink)


with open("drinks.json", "w") as outfile:
    json.dump(drinks, outfile, indent=4)




# drink["ingredients"] = ings;
#
# print drink;

# for index,url in enumerate(urls):
#     page = requests.get(url);
#     tree = html.fromstring(page.text)
#
#     some_drinks = tree.xpath("//a[contains(@href,'wiki')]/text()");
#
#     if index == 0:
#         indices = [0,201]
#     elif index == 1:
#         indices = [1,202]
#     elif index == 2:
#         indices = [0,99]
#
#
#     drinks += some_drinks[indices[0]+1:indices[1]]
#
# for drink in drinks:
#     url = urllib.urlencode("http://wiki.webtender.com/wiki/drink/"+drink);
#     page = requests.get(url);
#     tree = html.fromstring(page.text)
