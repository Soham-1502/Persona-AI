
content = open(r'd:\Yash\Persona-AI new 2\Persona-AI\public\fallback_easy.json', encoding='utf-8').read()
print(f"[: {content.count('[')}")
print(f"]: {content.count(']')}")
print(f"{{: {content.count('{')}")
print(f"}}: {content.count('}')}")
