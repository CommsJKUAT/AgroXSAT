from geopy.distance import geodesic

# Define the coordinates
coords_1 = (-1.193179, 36.759202)  # London
coords_2 = (40.7128, -74.0060)  # New York

# Calculate distance
distance = geodesic(coords_1, coords_2).kilometers
print(f"Distance: {distance:.2f} km")
