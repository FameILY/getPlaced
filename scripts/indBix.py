from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import argparse
import re

def scrape_indBix(company, pno):

    try:

        # Set up Selenium WebDriver
        service = Service('C:\chromedriver-win64\chromedriver-win64\chromedriver.exe')  # Set the path to your chromedriver
        options = Options()
        options.add_argument('--headless')  # Run Chrome in headless mode (no GUI)
        options.add_argument('--log-level=3') #prevent unnecessary console logs 
        driver = webdriver.Chrome(service=service, options=options)


        url = f"https://www.indiabix.com/placement-papers/{company}/{pno}"
        driver.get(url)

        # Wait for the page to load completely (you may need to adjust this timeout)
        driver.implicitly_wait(10)

        # Get the page source after JavaScript execution
        html_content = driver.page_source

        # Use BeautifulSoup to parse the HTML content
        soup = BeautifulSoup(html_content, "html.parser")

        element = soup.find("div", class_="topics-wrapper") 
        data = element.find("div", class_="paper-data").text.strip()

        testData = []
        for match in re.finditer(r'(\d+)\.\s*(.*?)\s*Answer:\s*([a-d])\s*Solution:\s*((?:(?!(?:\d+\.\s*|\Z)).)*)', data, re.DOTALL):

            question_statement = match.group(2).strip()
            options = [
                {"option": "a", "text": match.group(3).strip()}
            ]
            solution = match.group(4).strip()

            # Store question information in a dictionary
            question_info = {
                "question_statement": question_statement,
                "options": options,
                "correct_answer": options[0]["text"],  # We'll just use the first option as the correct answer
                "solution": solution
            }
            testData.append(question_info)
        
        print(json.dumps(testData, indent=2))
        thumbnail_element = element.find("div", class_="company-img") #done
        thumbnail = thumbnail_element.find("img")["src"] #done

            

            # questions.append({
            #     # "resourceTitle": title, 
            #     # "resourceLink": completeLink, 
            #     "testData": data,
            #     "testThumbnail": thumbnail, 
            #     "testCompany": company, 
            #     "testType": "aptitude"})

        # with open('questions.json', 'w') as json_file:
        #     json.dump(questions, json_file)
        # Print quest information
        # for quest in questions:
        #     print("Title:", quest["title"])
        #     print("Link:", quest["link"])
        #     print("Thumbnail:", quest["thumbnail"])
        #     print("--------------------------------")
            
        # Convert questions list to JSON string
        # questions_json = json.dumps(questions, indent=2)
        # print(questions_json)

        # Print JSON string to stdout
        # print(questions_json)
        

    except Exception as e:
        print(f"An error occurred: {str(e)}")

    finally:
        # Close the WebDriver
        if 'driver' in locals():
            driver.quit()

scrape_indBix("Amazon", "6612")

# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description='Scrape questra questions.')
#     parser.add_argument('company', type=str, help='company string for questions search')

#     args = parser.parse_args()
#     scrape_indBix(args.company)