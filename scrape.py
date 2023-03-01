import requests as req
from bs4 import BeautifulSoup
from lxml import etree

# url ="https://content.civicplus.com/api/assets/56ffc449-ba17-444b-af49-13e710776a55"
# resp = req.get(url)

# with open('my_pdf.pdf', 'wb') as f:
#  dh  f.write(resp.content)


list_url = 'https://www.portlandmaine.gov/472/Daily-Media-Logs'
list_page_resp = req.get(list_url) 
soup = BeautifulSoup(list_page_resp.content, 'html.parser')
dom = etree.HTML(str(soup))
# print(dom.xpath('//*[@id="firstHeading"]')[0].text)

ul_xpath = '//*[@id="widget0a208dd8-b51a-4e64-8157-04f981e4e74d"]/div/div/div/div/div/div/div/div/div/div[2]/div/ul'

res = dom.xpath(ul_xpath)

print(res)



