from typing import Optional
from atk_stt import *
from atk_keyword import get_keywords
from atk_make_dict import make_dict

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Keyword(BaseModel):
    content: str


class KeywordOut(BaseModel):
    result: list


class KeywordList(BaseModel):
    keywords: list


@app.get("/items/{file_name}")
async def read_item(file_name: str):
    trans = get_stt(f"seokju/{file_name}.wav")
    return {"trans": trans}


@app.get("/api/stt")
async def read_item(username: str, filename: str):
    final_filename = f"{username}/{filename}"
    print(final_filename)
    trans = get_stt(final_filename)
    return {"result": trans}

#
# @app.post("/api/keyword")
# async def extract_keyword(keyword: Keyword):
#     print(keyword.content)
#     result = get_keywords(keyword.content)
#     return {
#         "result": result
#     }


@app.get("/api/keyword-info")
async def make_keyword_info(keyword: str):
    result = make_dict(keyword)
    return result

# @app.post("/api/keyword-info")
# async def make_keyword_info(keywords: KeywordList):
#     print(keywords)
#     result = make_dict(keywords.keywords)
#     return {
#         "result": result
#     }
