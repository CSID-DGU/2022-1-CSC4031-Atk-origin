#!/usr/bin/python
# -*- coding: <UTF-8> -*-

import json

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

def test_func(a, b):
    c = a + b
    return c


def main():
    # print("hello")
    print(geeks())


if __name__ == "__main__":
    main()