import requests as req
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# chrome_options = Options()
# chrome_options.add_argument("--headless")

driver = webdriver.Chrome('./chromedriver', options={})
url = 'https://www.portlandmaine.gov/472/Daily-Media-Logs'

driver.get(url)
path = '/html/body/div[4]/div/div[2]/div[2]/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div/div/div/div/div/div[2]/div/ul'

wait = WebDriverWait(driver, 10)

element = wait.until(EC.presence_of_element_located((By.XPATH, path)))

ul = driver.find_element(By.XPATH, path)

li_tags = ul.find_elements(By.TAG_NAME, "li")

for li in li_tags:
    a_tag = li.find_element(By.TAG_NAME, "a")
    href = a_tag.get_attribute("href")
    resp = req.get(href)
    filepath = os.path.join('pdfs', href.split('/')[-1])
    with open(f'{filepath}.pdf', 'wb') as f:
        f.write(resp.content)



