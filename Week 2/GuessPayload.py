A = "An encyphering-deciphering machine (in general outline) of my invention has been sent to your organization."
B = "The most direct computation would be for the enemy to try all 2^r possible keys, one by one."
C = "We see immediately that one needs little information to begin to break down the process."
D = "To consider the resistance of the enciphering process to being broken we should assume that at the same times the enemy knows everything but the key being used and to break it needs only discover the key from this information."

test = [A, B, C, D]
IV = 16

for i in range(4):
    length = len(test[i])
    padding = 16 - length % 16
    totalLength = length + padding + IV
    if totalLength == 128:
        print("Success at Test", chr(65 + i))