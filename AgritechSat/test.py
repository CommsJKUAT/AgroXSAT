import json

content= {"_content_type": ["application/json"], "_content": ["{\r\n        \"temperature\": 24,\r\n        \"humidity\": 60\r\n    }"]}


content = content.get('_content')  # Access the content from the QueryDict
print(content[0].replace("\r\n", ""))
