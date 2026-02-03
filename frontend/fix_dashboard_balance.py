path = r"c:/Users/admin/Desktop/financial health/frontend/src/components/Dashboard.jsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add one closing div before the end of the return statement
# The file ends with:
#             </div>
#         </div>
#     );
# };

# We will look for the specific footer
target = "        </div>\n    );\n};"
replacement = "        </div>\n            </div>\n    );\n};"

# If exact string match fails due to whitespace, we try a flexible approach
if target not in content:
    # Try just replacing the last occurrence of </div>
    idx = content.rfind("</div>")
    if idx != -1:
        # Check context
        content = content[:idx+6] + "\n            </div>" + content[idx+6:]
else:
    content = content.replace(target, replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added missing closing div")
