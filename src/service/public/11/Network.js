import { lerp } from "../common/utils/index.js";

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      // TODO: binary just last layer
      if (level.outputs.length === 4) {
        if (sum + level.biases[i] > 0) {
          level.outputs[i] = 1;
        } else {
          level.outputs[i] = 0;
        }
      } else {
        level.outputs[i] = Math.tanh(sum + level.biases[i]);
      }

      // if (sum + level.biases[i] > 0) {
      //   level.outputs[i] = 1;
      // } else {
      //   level.outputs[i] = 0;
      // }
    }

    return level.outputs;
  }
}

export class NeuralNetwork {
  constructor(neuronCounts, levels = null) {
    this.levels = levels ? levels : [];

    if (!this.levels.length) {
      for (let i = 0; i < neuronCounts.length - 1; i++) {
        this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
      }
    }
  }

  loadBrain(levels) {
    this.levels = levels;
  }

  static mutate(network, amount = 1) {
    const networkCopy = new NeuralNetwork([0]);
    networkCopy.levels = JSON.parse(JSON.stringify(network.levels));

    networkCopy.levels.forEach(level => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }

      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
        }
      }
    });

    return networkCopy;

    // network.levels.forEach(level => {
    //   for (let i = 0; i < level.biases.length; i++) {
    //     level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
    //   }

    //   for (let i = 0; i < level.weights.length; i++) {
    //     for (let j = 0; j < level.weights[i].length; j++) {
    //       level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
    //     }
    //   }
    // });
  }

  train(givenInputs, expectedOutputs) {
    const outputs = NeuralNetwork.feedForward(givenInputs, this);

    const errors = [];
    for (let i = 0; i < outputs.length; i++) {
      errors[i] = expectedOutputs[i] - outputs[i];
    }

    for (let i = this.levels.length - 1; i >= 0; i--) {
      const level = this.levels[i];

      const gradients = [];
      for (let j = 0; j < level.outputs.length; j++) {
        gradients[j] = errors[j] * (1 - level.outputs[j] * level.outputs[j]);
      }

      const hiddenGradients = [];
      for (let j = 0; j < level.inputs.length; j++) {
        let sum = 0;
        for (let k = 0; k < level.outputs.length; k++) {
          sum += level.weights[j][k] * gradients[k];
        }

        hiddenGradients[j] = sum * (1 - level.inputs[j] * level.inputs[j]);
      }

      for (let j = 0; j < level.biases.length; j++) {
        level.biases[j] += gradients[j] * 0.1;
      }

      for (let j = 0; j < level.weights.length; j++) {
        for (let k = 0; k < level.weights[j].length; k++) {
          level.weights[j][k] += level.inputs[j] * gradients[k] * 0.1;
        }
      }

      errors.splice(0, level.outputs.length);
      errors.unshift(...hiddenGradients);
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);

    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }

  static train(givenInputs, expectedOutputs, network) {
    const outputs = NeuralNetwork.feedForward(givenInputs, network);

    const errors = [];
    for (let i = 0; i < outputs.length; i++) {
      errors[i] = expectedOutputs[i] - outputs[i];
    }

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const level = network.levels[i];

      const gradients = [];
      for (let j = 0; j < level.outputs.length; j++) {
        gradients[j] = errors[j] * (1 - level.outputs[j] * level.outputs[j]);
      }

      const hiddenGradients = [];
      for (let j = 0; j < level.inputs.length; j++) {
        let sum = 0;
        for (let k = 0; k < level.outputs.length; k++) {
          sum += level.weights[j][k] * gradients[k];
        }

        hiddenGradients[j] = sum * (1 - level.inputs[j] * level.inputs[j]);
      }

      for (let j = 0; j < level.biases.length; j++) {
        level.biases[j] += gradients[j] * 0.1;
      }

      for (let j = 0; j < level.weights.length; j++) {
        for (let k = 0; k < level.weights[j].length; k++) {
          level.weights[j][k] += level.inputs[j] * gradients[k] * 0.1;
        }
      }

      errors.splice(0, level.outputs.length);
      errors.unshift(...hiddenGradients);
    }

    return outputs;
  }

  serialize() {
    return JSON.stringify(this.levels);
  }

  static crossover(network1, network2) {
    const network = new NeuralNetwork([0]);
    network.levels = JSON.parse(JSON.stringify(network1.levels));

    network.levels.forEach((level, i) => {
      for (let j = 0; j < level.biases.length; j++) {
        if (Math.random() > 0.5) {
          level.biases[j] = network2.levels[i].biases[j];
        }
      }

      for (let j = 0; j < level.weights.length; j++) {
        for (let k = 0; k < level.weights[j].length; k++) {
          if (Math.random() > 0.5) {
            level.weights[j][k] = network2.levels[i].weights[j][k];
          }
        }
      }
    });

    return network;
  }

  static deserialize(serialized) {
    let network = new NeuralNetwork([0]);
    network.levels = JSON.parse(serialized).levels;
    return network;
  }
}
