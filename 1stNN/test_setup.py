import tensorflow as tf
import numpy as np

# Print TensorFlow version
print(f"TensorFlow version: {tf.__version__}")

# Create a simple tensor
x = tf.constant([[1., 2., 3.],
                 [4., 5., 6.]])
print(f"\nTest tensor shape: {x.shape}")
print(f"Test tensor values:\n{x.numpy()}")

# Test GPU availability
print(f"\nGPU available: {tf.config.list_physical_devices('GPU')}")