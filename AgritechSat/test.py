import json

content= <QueryDict: {'_content_type': ['application/json'], '_content': ['\r\n        "temperature": 24,\r\n        "humidity": 60\r\n  ']}>
cleaned_query_dict = content.strip('<>').strip()
print(cleaned_query_dict)
content = content.get('_content')  # Access the content from the QueryDict
data = json.loads(content)  # Parse the JSON string

# Now you can access the data as a dictionary
temperature = data['temperature']
humidity = data['humidity']
