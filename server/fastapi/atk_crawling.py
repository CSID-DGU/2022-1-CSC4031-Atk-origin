import sys
import requests
from bs4 import BeautifulSoup


def search_daum_dic(query_keyword):
    dic_url = """http://dic.daum.net/search.do?q={0}"""
    r = requests.get(dic_url.format(query_keyword))
    soup = BeautifulSoup(r.text, "html.parser")
    result_means = soup.find(attrs={'class': 'list_search'}).children
    for r in result_means:
        cur = r.text.strip()
        if not cur:
            continue
        try:
            result = cur[cur.index(".") + 1:]
        except ValueError:
            result = cur
        return result


if __name__ == "__main__":
    print(search_daum_dic("clock"), end="")
