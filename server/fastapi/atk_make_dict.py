from atk_crawling import search_daum_dic
from oxford_api import *


def make_dict(keyword):
    json_data1, json_data2 = get_entries_and_thesaurus(keyword)
    if (json_data1 is None) and (json_data2 is None):
        print("*******")
        print("no data for keyword ", keyword)
        print("*******")
        return
    print(json_data1)
    print(json_data2)

    # 단어, 내용
    main_word = get_word(json_data1)
    main_contents1, main_contents2 = get_content(json_data1, json_data2)

    meaning = search_daum_dic(main_word)

    # 정의
    definition = get_definition(main_contents1)

    # 품사 태깅
    pos = get_word_pos(json_data1)

    # 예문 original
    examples_original_str, examples_original_list = return_examples_original(main_contents1, main_contents2)

    # 예문 lemmatized
    examples_lemmatized_str, _ = return_examples_lemmatized(examples_original_list, main_word, pos)

    # 유의어
    synonyms = get_synonym(main_contents1, json_data1)

    # 반의어
    antonym = get_antonym(main_contents2)

    tmp_dict = dict()
    tmp_dict['meaning'] = meaning
    tmp_dict['definition'] = definition
    tmp_dict['synonyms'] = synonyms
    tmp_dict['antonym'] = antonym
    tmp_dict["example"] = f"{examples_original_str}|{examples_lemmatized_str}" \
        if examples_original_str and examples_lemmatized_str else ""

    print("----------------------------")
    print("main_word : ", main_word)
    print("meaning : ", meaning)
    print()
    print("definition : ", definition)
    print("synonyms : ", synonyms)
    print("antonym : ", antonym)
    print("examples ori : ", examples_original_str)
    print("examples lemma : ", examples_lemmatized_str)
    print("----------------------------")
    return tmp_dict


if __name__ == "__main__":
    make_dict('eat,sleep')
