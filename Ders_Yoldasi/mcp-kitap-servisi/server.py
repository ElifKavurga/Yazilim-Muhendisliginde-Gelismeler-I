from fastmcp import FastMCP
import requests


mcp = FastMCP("Kitap Oneri Servisi")


@mcp.tool()
def kitap_ara(konu: str):
    yanit = requests.get(
        f"https://openlibrary.org/search.json?q={konu}",
        timeout=10,
    )
    yanit.raise_for_status()
    veri = yanit.json()
    kitaplar = []

    for kitap in veri.get("docs", [])[:5]:
        kitaplar.append(
            {
                "title": kitap.get("title"),
                "author_name": kitap.get("author_name"),
                "first_publish_year": kitap.get("first_publish_year"),
                "cover_i": kitap.get("cover_i"),
            }
        )

    return kitaplar


if __name__ == "__main__":
    mcp.run(transport="sse", host="0.0.0.0", port=8000)
