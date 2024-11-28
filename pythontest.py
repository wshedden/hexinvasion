import matplotlib.pyplot as plt
import numpy as np

# Function to draw a hexagon
def hexagon(x_center, y_center, size):
    angle = np.linspace(0, 2 * np.pi, 7)
    x_hex = x_center + size * np.cos(angle)
    y_hex = y_center + size * np.sin(angle)
    return x_hex, y_hex

# Function to generate a tesselating hexagonal grid
def draw_hexagonal_grid(rows, cols, size):
    fig, ax = plt.subplots()
    
    # Constants for hexagon positioning
    dx = 3/2 * size
    dy = np.sqrt(3) * size

    # Draw hexagons in a grid pattern
    for row in range(rows):
        for col in range(cols):
            x = col * dx
            y = row * dy
            # Offset every other column
            if col % 2 == 1:
                y += dy / 2
            
            x_hex, y_hex = hexagon(x, y, size)
            ax.plot(x_hex, y_hex, 'b')

    ax.set_aspect('equal')
    plt.axis('off')
    plt.show()

# Parameters for the grid
rows = 10
cols = 10
size = 1

# Draw the hexagonal grid
draw_hexagonal_grid(rows, cols, size)
