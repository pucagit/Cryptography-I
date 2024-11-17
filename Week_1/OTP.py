m1 = "attack at dawn"
c1 = "09e1c5f70a65ac519458e7e53f36"
m2 = "attack at dusk"

key = int(c1, 16) ^ int(m1.encode().hex(), 16) 
c2 = hex(key ^ int(m2.encode().hex(), 16))[2:]
print(c2)