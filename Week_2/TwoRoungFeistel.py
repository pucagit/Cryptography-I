A = ["9f970f4e 932330e4", "6068f0b1 b645c008"]
B = ["7c2822eb fdc48bfb", "325032a9 c5e2364b"]
C = ["4af53267 1351e2e1", "87a40cfa 8dd39154"]
D = ["2d1cfa42 c0b1d266", "eea6e3dd b2146dd0"]

test = [A, B, C, D]
answer = ["A", "B", "C", "D"]

def xor_first_32_bits(hex1, hex2):
    # Convert the first 32 bits of the hex strings to integers
    int1 = int(hex1[:8], 16)
    int2 = int(hex2[:8], 16)
    
    # Perform XOR operation
    xor_result = int1 ^ int2
    
    # Convert the result back to hexadecimal
    return hex(xor_result)[2:].zfill(8)

for i in range(4):
    hex1 = test[i][0]
    hex2 = test[i][1]
    xor_result = xor_first_32_bits(hex1, hex2)
    if xor_result == "ffffffff":
        print("Success at Test", answer[i])
        break