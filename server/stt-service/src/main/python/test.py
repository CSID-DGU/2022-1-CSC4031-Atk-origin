#!/usr/bin/python
# -*- coding: <UTF-8> -*-

import json
import os

# Create geeks function


def geeks():

    # Define Variable
    language = "Python"
    company = "GeeksForGeeks"
    Itemid = 1
    price = 0.00

    # Create Dictionary
    value = {
        "language": language,
        "company": company,
        "itemI"
        "d": Itemid,
        "price": price
    }

    # Dictionary to JSON Object using dumps() method
    # Return JSON Object
    return json.dumps(value)


# Call Function and Print it.

def test_keyword():
    result = [('child', 30), ('aring', 24), ('practices', 19), ('The', 16), ('study', 16), ('children', 16), ('mothers', 14), ('Patter', 13), ('ns', 13), ('S', 11)]
    result = [word for word, count in result]
    print(",".join(result))


def main():
    # print("hello")
    # print(geeks())
    test_keyword()


if __name__ == "__main__":
    main()