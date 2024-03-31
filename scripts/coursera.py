from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import argparse

def scrape_coursera(query):

    try:

        # Set up Selenium WebDriver
        service = Service('C:\chromedriver-win64\chromedriver-win64\chromedriver.exe')  # Set the path to your chromedriver
        options = Options()
        options.add_argument('--headless')  # Run Chrome in headless mode (no GUI)
        options.add_argument('--log-level=3') #prevent unnecessary console logs 
        driver = webdriver.Chrome(service=service, options=options)


        url = f"https://www.coursera.org/courses?query={query}"
        driver.get(url)

        # Wait for the page to load completely (you may need to adjust this timeout)
        driver.implicitly_wait(100)

        # Get the page source after JavaScript execution
        html_content = driver.page_source

        # Use BeautifulSoup to parse the HTML content
        soup = BeautifulSoup(html_content, "html.parser")

        courses = []
        for course in soup.find_all("li", class_="cds-9 css-0 cds-11 cds-grid-item cds-56 cds-64 cds-76 cds-90"): #done
            title = course.find("h3", class_="cds-CommonCard-title css-6ecy9b").text.strip() #done
            link = course.find("a", class_="cds-119 cds-113 cds-115 cds-CommonCard-titleLink css-si869u cds-142")["href"] #done
            completeLink = "https://www.coursera.org" + link
            thumbnail_element = course.find("div", class_="cds-CommonCard-previewImage") #done
            thumbnail = thumbnail_element.find("img")["src"] #done
            courses.append({"resourceTitle": title, "resourceLink": completeLink, "resourceThumbnail": thumbnail, "resourceDomain": query, "resourceType": "Course"})

        # with open('courses.json', 'w') as json_file:
        #     json.dump(courses, json_file)
        # Print course information
        # for course in courses:
        #     print("Title:", course["title"])
        #     print("Link:", course["link"])
        #     print("Thumbnail:", course["thumbnail"])
        #     print("--------------------------------")
            
        # Convert courses list to JSON string
        courses_json = json.dumps(courses)

        # Print JSON string to stdout
        print(courses_json)

    except Exception as e:
        print(f"An error occurred: {str(e)}")

    finally:
        # Close the WebDriver
        if 'driver' in locals():
            driver.quit()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape Coursera courses.')
    parser.add_argument('query', type=str, help='Query string for courses search')

    args = parser.parse_args()
    scrape_coursera(args.query)