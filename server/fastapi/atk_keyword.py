from nltk import tokenize
from operator import itemgetter
import math
import unicodedata
from nltk.corpus import stopwords
import spacy


def check_sent(word, sentences):
    final = [all([w in x for w in word]) for x in sentences]
    sent_len = [sentences[i] for i in range(len(final)) if final[i]]
    return int(len(sent_len))


def get_top_n(dict_elem, n):
    return sorted(dict_elem.items(), key=itemgetter(1), reverse=True)[:n]


def get_keywords(data: str):
    data = data.lower()
    doc = unicodedata.normalize("NFKD", data)
    stop_words = set(stopwords.words('english'))
    total_words = doc.split()

    word_list = list()  # list
    lemma_list = list()
    sp = spacy.load('en_core_web_sm')
    sen = sp(doc)
    pos_list = ['ADJ', 'NOUN', 'VERB', 'X']

    for word in sen:
        if '’' in str(word):
            continue
        if word.pos_ in pos_list:
            lemmatized_ = word.lemma_
            lemma_list.append(str(lemmatized_))
            word_list.append(str(word))

    total_words = lemma_list
    total_word_length = len(word_list)
    total_sentences = tokenize.sent_tokenize(doc)
    total_sent_len = len(total_sentences)

    tf_score = {}
    for word in total_words:
        word = word.replace('.', '')
        word = word.replace('%', '')
        if word not in stop_words and word in total_words:
            if word in tf_score:
                tf_score[word] += 1
            else:
                tf_score[word] = 1

    tf_score.update((x, y / int(total_word_length)) for x, y, in tf_score.items())

    idf_score = {}
    for word in total_words:
        word = word.replace('.', '')
        word = word.replace('%', '')
        if word not in stop_words and word in total_words:
            if word in idf_score:
                idf_score[word] = check_sent(word, total_sentences)
            else:
                idf_score[word] = 1

    idf_score.update((x, math.log(int(total_sent_len) / y)) for x, y in idf_score.items())

    tf_idf_score = {key: tf_score[key] * idf_score.get(key, 0) for key in tf_score.keys()}

    return ",".join([k for k, v in get_top_n(tf_idf_score, 10)])


if __name__ == "__main__":
    data = """In the Egyptian Book of the Dead, there’s a banishment spell that declares, “Be far from me,
        O vile cockroach.” More than 3,000 years later, we’re still trying to oust these insects. But from poison traps to
        hastily brandished slippers, cockroaches seem to weather just about everything we throw at them. So what makes
        cockroaches so hard to kill? There are nearly 5,000 cockroach species. 99% of them live in a range of habitats where
        they play important ecological roles by recycling dead or decaying organic matter and nourishing other animals. But a
        couple dozen species adapted to live in close association with humans. German and American cockroaches are among the
        most common. And they owe their resilience to a combination of physical and chemical adaptations. When it comes to
        old-fashioned removal methods, they're troublingly tenacious. An American cockroach’s sensory hairs or structures
        pick up subtle air currents and rapidly send signals to its central nervous system. The roach can then turn and
        sprint away within a few milliseconds. And it’s among the fastest invertebrates ever recorded, reaching speeds of up
        to 50 body lengths per second. This would be the human equivalent of running more than 300 kilometers per hour. And
        finding a hiding place is no problem. With its flattened, flexible body, an American cockroach can squeeze into
        spaces less than a quarter of its height. Even if we do land a hit, it can withstand compressive forces of up to 900
        times its own weight by distributing the impact along its body. And the cockroach’s toughness doesn’t end
        there. Cockroaches can eat a variety of organic matter, including hair, dead skin, adhesives, and paper. This is made
        possible by an expansive set of digestive enzymes. Cockroaches are able to thrive even in nutrient-poor
        environments. Roaches often eat decaying foods that are low in nitrogen— an essential component of DNA and
        proteins. But they survive by storing nitrogen-containing wastes in their bodies and having a resident group of
        bacteria recycle the nitrogen into useful molecules for them. Meanwhile, German cockroaches will eat their own poop,
        vomit, and dead or dying colony members without hesitation. An American cockroach will frolic in sewers, consuming
        excrement and toting microbes like Staphylococcus aureus and E.coli. But they’ll rarely suffer any consequences. This
        is because they’re equipped with genes that provide immunity against numerous pathogens. These genes are often
        duplicated many times over. So when infected, the cockroach’s immune system efficiently unleashes many antimicrobial
        molecules. Cockroaches also have a slew of defenses against pesticides. When a non-resistant roach walks on a surface
        that’s been sprayed with a pyrethroid insecticide, for example, the results will likely be fatal. Once absorbed,
        the chemical binds to sodium channel proteins, which help propagate nerve impulses. The pyrethroid keeps the sodium
        channels open, so the nerves fire repeatedly. And soon, the cockroach dies. But if a resistant roach is exposed to
        pyrethroids, it’ll be just fine. Genetic mutations have given them sodium channels that the pyrethroids can’t bind
        to. The cockroach also produces more detoxification enzymes, which render the pesticide harmless, and the cockroach
        simply excretes it as a waste. Because German cockroaches reproduce especially quickly, populations may evolve
        resistance to a new pesticide within months. So far, they're already resistant to 43 different chemicals. But
        contrary to popular belief, cockroaches would probably not survive a nuclear apocalypse. Compared with other insects,
         cockroaches are only mildly tolerant to radiation. They would die near the sites of nuclear explosions and would
        still be severely compromised miles away. Moreover, disasters that threaten humanity also jeopardize the habitats and
        buffets we provide roaches. Perhaps the only way to beat them is through our mutual destruction. Or maybe cockroaches
        would find even more surprising ways to thrive long after we’re gone. """

    print(get_keywords(data))
