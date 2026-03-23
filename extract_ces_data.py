import os
import re
import csv

def extract_data(file_path, joint_name):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the protocol block
    # We look for protocol: { then anything until the next major block or end of object
    # A safe bet is looking for the content between protocol: { and the closing } for it.
    # Since it's nested, we'll use a simple count or a broad search if the structure is simple.
    
    protocol_re = re.compile(r'protocol:\s*\{(.*?)},\s*integrate:', re.DOTALL)
    protocol_match = protocol_re.search(content)
    
    if not protocol_match:
        # Fallback for cases without integrate or slightly different trailing characters
        protocol_re = re.compile(r'protocol:\s*\{(.*?)},?\s*\n};', re.DOTALL)
        protocol_match = protocol_re.search(content)

    if not protocol_match:
        print(f"Warning: Could not isolate protocol block in {file_path}")
        protocol_content = content
    else:
        protocol_content = protocol_match.group(1)

    # Movements are keys in protocol: flexion, extension, etc.
    # Pattern: move_name: { ... }
    # We look for words followed by : { and then anything until },
    movements = re.findall(r'(\w+):\s*\{(.*?)\n\s*\},', protocol_content, re.DOTALL)
    
    extracted_rows = []
    for move_name, move_content in movements:
        # Categories: inhibit, lengthen, activate
        # Pattern: cat_name: [ ... ],
        categories = re.findall(r'(\w+):\s*\[(.*?)\],', move_content, re.DOTALL)
        for cat_name, cat_content in categories:
            # ex calls: ex('id', 'title', 'desc', 'yt', {details})
            # Regex for ex call:
            # Group 1: ID, Group 2: Title, Group 3: Description, Group 4: Youtube ID, Group 5: Details (optional)
            ex_pattern = re.compile(r"ex\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*(?:,\s*\{(.*?)\})?\s*\)", re.DOTALL)
            ex_calls = ex_pattern.findall(cat_content)
            
            for ex_id, title, desc, yt, details in ex_calls:
                row = {
                    'Joint': joint_name,
                    'Movement': move_name,
                    'Category': cat_name,
                    'ID': ex_id,
                    'Title': title,
                    'Description': desc.replace('\n', ' ').strip(),
                    'YoutubeID': yt
                }
                
                # Parse details: tools: '...', holdSeconds: 30, sets: 2, reps: 15
                if details:
                    tools_match = re.search(r"tools:\s*['\"]([^'\"]*)['\"]", details)
                    row['Tools'] = tools_match.group(1) if tools_match else ''
                    
                    hold_match = re.search(r"holdSeconds:\s*(\d+)", details)
                    row['Hold Seconds'] = hold_match.group(1) if hold_match else ''
                    
                    sets_match = re.search(r"sets:\s*(\d+)", details)
                    row['Sets'] = sets_match.group(1) if sets_match else ''
                    
                    reps_match = re.search(r"reps:\s*(\d+)", details)
                    row['Reps'] = reps_match.group(1) if reps_match else ''
                else:
                    row['Tools'] = ''
                    row['Hold Seconds'] = ''
                    row['Sets'] = ''
                    row['Reps'] = ''
                
                extracted_rows.append(row)
    
    return extracted_rows

def main():
    base_dir = '/Users/jeonghunsakong/Desktop/개인/물리치료학과/졸업논문/ROM 측정기/src/lib/ces'
    files = {
        'elbow.ts': 'Elbow',
        'hip.ts': 'Hip',
        'knee.ts': 'Knee',
        'shoulder.ts': 'Shoulder',
        'waist.ts': 'Waist',
        'wrist.ts': 'Wrist'
    }
    
    all_data = []
    for file_name, joint_name in files.items():
        file_path = os.path.join(base_dir, file_name)
        if os.path.exists(file_path):
            print(f"Processing {file_name}...")
            data = extract_data(file_path, joint_name)
            all_data.extend(data)
        else:
            print(f"Warning: File not found: {file_path}")

    output_file = '/Users/jeonghunsakong/Desktop/개인/물리치료학과/졸업논문/ROM 측정기/ces_data_summary.csv'
    fieldnames = ['Joint', 'Movement', 'Category', 'ID', 'Title', 'Description', 'Tools', 'Hold Seconds', 'Sets', 'Reps', 'YoutubeID']
    
    with open(output_file, 'w', encoding='utf-8-sig', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in all_data:
            writer.writerow(row)
            
    print(f"Successfully generated: {output_file}")

if __name__ == "__main__":
    main()
