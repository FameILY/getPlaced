from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options as EdgeOptions
from bs4 import BeautifulSoup
import json
import argparse


def scrape_medium(query):

    try:

           # Set up Selenium WebDriver for Edge
        service = EdgeService('C:\edgedriver\msedgedriver.exe')  # Set the path to your msedgedriver executable
        options = EdgeOptions()
        options.use_chromium = True  # Use Chromium Edge
        options.add_argument('--headless')  # Run Edge in headless mode (no GUI)
        options.add_argument('--log-level=3') # Prevent unnecessary console logs 
        driver = webdriver.Edge(service=service, options=options)


        url = f"https://medium.com/search?q={query}"
        driver.get(url)

        # Wait for the page to load completely (you may need to adjust this timeout)
        driver.implicitly_wait(100)

        # Get the page source after JavaScript execution
        html_content = driver.page_source

        # Use BeautifulSoup to parse the HTML content
        soup = BeautifulSoup(html_content, "html.parser")

        articles = []
        for article in soup.find_all("article"): 
            # author_element = article.find("div", class_="1")
            # author = author_element.text.strip() if author_element else "Unknown"

            title_element = article.find("a", class_="af ag ah ai aj ak al am an ao ap aq ar as at")
            element = title_element.find("h2")
            title = element.text.strip() if element else "Untitled"
            # title_element = article.find("h2", class_="be fs ok gr acl acm om on gu acn aco op oq os any ajy ot nx pt acr acs pu oy pa anz akc pb iu iw ix iz jb bj")
            # title = title_element.text.strip() if title_element else "Untitled"

            snippet_element = title_element.find("h3")
            snippet = snippet_element.text.strip() if snippet_element else "No snippet available"

            link_element = article.find("a", class_="af ag ah ai aj ak al am an ao ap aq ar as at")
            completeLink = "https://www.medium.com" + link_element["href"] if link_element else "#"

            # time_element = article.find("a", class_="af ag ah ai aj ak al am an ao ap aq ar as at")
            # time = time_element.find("span").text.strip() if time_element else "Unknown"

            thumbnail_element = article.find("div", class_="j d")
            thumbnail = thumbnail_element.find("img")["src"] if thumbnail_element else ""

            articles.append({
                "resourceTitle": title,
                "resourceSnippet": snippet,
                # "articleAuthor": author,
                "resourceLink": completeLink,
                # "Duration": time,
                "resourceThumbnail": thumbnail,
                "resourceDomain": query,
                "resourceType": "article"
            })

        # with open('articles.json', 'w') as json_file:
        #     json.dump(articles, json_file)
        # Print article information
        # for article in articles:
        #     print("Title:", article["title"])
        #     print("Link:", article["link"])
        #     print("Thumbnail:", article["thumbnail"])
        #     print("--------------------------------")
            
        # Convert articles list to JSON string
        articles_json = json.dumps(articles)

        # Print JSON string to stdout
        print(articles_json)

    except Exception as e:
        print(f"An error occurred: {str(e)}")

    finally:
        # Close the WebDriver
        if 'driver' in locals():
            driver.quit()

# scrape_medium('Node js')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape medium articles.')
    parser.add_argument('query', type=str, help='Query string for articles search')

    args = parser.parse_args()
    scrape_medium(args.query)