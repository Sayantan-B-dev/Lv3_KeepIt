import os

def build_tree(start_path, prefix="", output_lines=None):
    if output_lines is None:
        output_lines = []

    ignore_dirs = {"node_modules", ".git"}

    try:
        items = sorted(os.listdir(start_path))
    except PermissionError:
        return output_lines

    items = [item for item in items if item not in ignore_dirs]

    for index, item in enumerate(items):
        path = os.path.join(start_path, item)
        connector = "└── " if index == len(items) - 1 else "├── "

        line = prefix + connector + item
        output_lines.append(line)

        if os.path.isdir(path):
            extension = "    " if index == len(items) - 1 else "│   "
            build_tree(path, prefix + extension, output_lines)

    return output_lines


if __name__ == "__main__":
    root_folder = "."  # change this if needed
    output_file = "folder_structure.txt"

    tree_lines = build_tree(root_folder)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(tree_lines))

    print(f"Folder structure saved to {output_file}")