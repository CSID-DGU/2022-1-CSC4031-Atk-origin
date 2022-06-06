from nltk.stem import WordNetLemmatizer
import requests


def get_entries_and_thesaurus(word):
    app_id = '' # oxford_api_id
    app_key = '' # oxford_api_key
    language = 'en-gb'
    word_id = word
    url = 'https://od-api.oxforddictionaries.com/api/v2/entries/' + language + '/' + word_id.lower()
    r = requests.get(url, headers={'app_id': app_id, 'app_key': app_key})
    oxford_data1 = r.json()

    if 'error' in oxford_data1.keys():
        oxford_data1 = None

    url = 'https://od-api.oxforddictionaries.com/api/v2/thesaurus/' + language + '/' + word_id.lower()
    r = requests.get(url, headers={'app_id': app_id, 'app_key': app_key})
    oxford_data2 = r.json()

    if 'error' in oxford_data2.keys():
        oxford_data2 = None
    return oxford_data1, oxford_data2


# ----------------------------------------------------------------------

# 단어 이름
def get_word(data):
    return data['word']


# json 내용 받아오기
def get_content(data1, data2):
    if data1 is not None:
        contents_entries = data1['results'][0]['lexicalEntries'][0]
        # 정의, 유의어, 예문 포함한 메인 내용
        contents_entries = contents_entries['entries'][0]['senses'][0]
    else:
        contents_entries = None
    if data2 is not None:
        contents_thesaurus = data2['results'][0]['lexicalEntries'][0]['entries'][0]['senses']
    else:
        contents_thesaurus = None
    return contents_entries, contents_thesaurus


# 단어 정의
def get_definition(data):
    if data is not None:
        main_definition = data['definitions'][0]
        short_definition = data['shortDefinitions']
    else:
        main_definition = ''
    return main_definition


# ------------------------------------------------------------------------
# 퀴즈를 위한 예문 처리 (변형된 동사 리스트)

def get_word_pos(data):
    if data is not None:
        word_pos = data['results'][0]['lexicalEntries'][0]['lexicalCategory']['text']
    else:
        word_pos = ''
    return word_pos


# pos tag 전처리
def transform_pos(word_pos):
    """Map POS tag to first character lemmatize() accepts"""
    if word_pos == 'Noun':
        return 'n'
    elif word_pos == 'Verb':
        return 'v'
    elif word_pos == 'Adjective':
        return 'a'
    elif word_pos == '':
        return ''


# 예문 original
def return_examples_original(data1, data2):
    examples_original_list = list()
    examples_original_str = ''
    if data2 is not None:
        # api/thesaurus에서 받아온 예문
        try:
            examples_original_str = data2[0]['examples'][0]['text']
            examples_original_list.append(examples_original_str)
        except KeyError:
            pass
    # examples_original_list.append(data2[0]['examples'][0]['text'])
    # examples_original_list.append(data2[1]['examples'][0]['text'])
    # examples_original_list.append(data2[2]['examples'][0]['text'])
    elif data1 is not None:
        if 'examples' in data1.keys():
            # api/word에서 받아온 예문
            try:
                for example in data1['examples']:
                    examples_original_list.append(example['text'])
                if len(examples_original_list) == 0:
                    examples_original_list.append(data1['subsenses'][0]['examples'][0]['text'])
                for examples in examples_original_list:
                    examples_original_str += examples + "|"
            except KeyError:
                examples_original_str = examples_original_str[:-1]
        else:
            examples_original_str = ''
            examples_original_list = []
            # if word_pos != 'Noun':
            #     for example in data['examples']:
            #         examples_original.append(example['text'])
            #     if len(examples_original) == 0:
            #         examples_original.append(data['subsenses'][0]['examples'][0]['text'])
    else:
        examples_original_str = ''
        examples_original_list = []
    return examples_original_str, examples_original_list


# 예문 내 변환된 단어 본단어(lemmatize 된 단어)로 바꿔줌
def return_examples_lemmatized(examples, main_word, pos):
    examples_lemmatized_list = list()
    examples_lemmatized_str = ''
    if len(examples) != 0:
        l = WordNetLemmatizer()
        for sentence in examples:
            word_list = list()
            sentence = sentence.replace('—', ' ')
            sentence = sentence.split()
            for word in sentence:
                if pos == 'Verb' or pos == 'Noun':
                    normalized_word = l.lemmatize(word, transform_pos(pos))
                else:
                    normalized_word = word
                if normalized_word == main_word:
                    word = normalized_word
                word_list.append(word)
            sentence = ''
            for word in word_list:
                sentence += word
                sentence = sentence + ' '
            examples_lemmatized_list.append(sentence.strip() + '.')

        for sentence in examples_lemmatized_list:
            examples_lemmatized_str += sentence + '|'
        examples_lemmatized_str = examples_lemmatized_str[:-1]
    else:
        examples_lemmatized_str = ''
        examples_lemmatized_list = []
    return examples_lemmatized_str, examples_lemmatized_list


# 유의어 리스트
def get_synonym(data, tmp_data):
    # synonyms_list = list()
    synonyms = ''
    cnt = 0
    if 'synonyms' in data.keys():
        for syms in data['synonyms']:
            # synonyms_list.append(syms['text'])
            if cnt == 10:
                break
            synonyms += syms['text'] + '|'
            cnt += 1
    elif 'synonyms' in tmp_data['results'][0]['lexicalEntries'][0]['entries'][0]['senses'][0].keys():
        tmp = tmp_data['results'][0]['lexicalEntries'][1]['entries'][0]['senses'][0]
        for syms in tmp['synonyms']:
            # synonyms_list.append(syms['text'])
            if cnt == 10:
                break
            synonyms += syms['text'] + '|'
            cnt += 1
    else:
        synonyms = ''
    return synonyms[:-1]


# 반의어 str (1개)
def get_antonym(data):
    if data is None:
        antonym = ''
    elif not 'antonyms' in data[0].keys():
        antonym = ''
    else:
        antonym = data[0]['antonyms'][0]['text']
    return antonym
