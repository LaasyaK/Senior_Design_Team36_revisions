export const generateNewGrid = (originalGrid: boolean[][]): { newGrid: boolean[][]; isTemplate: boolean[][] } => {
      const inputRows = originalGrid.length;      // Save the input row count
      const inputCols = originalGrid[0].length;   // Save the input column count
  
      const outputSize = 4 * inputRows;
      const outputCols = 4 * inputCols;
  
      // initialize the output grid and template grid
      const newGrid = Array.from({ length: outputSize }, () => Array(outputCols).fill(false));
      const isTemplate = Array.from({ length: outputSize }, () => Array(outputCols).fill(false));
  
      // initialized the mirrored Inverse Grid
      const inverseGrid = Array.from({ length: outputSize }, () => Array(outputCols).fill(false));
      const mirroredInverseGrid = Array.from({ length: outputSize }, () => Array(outputCols).fill(false));
      
      // fixed template for each 4x4 block
      const template = [
          [true, true, true, false],  // Row 0
          [true, true, false, false], // Row 1
          [true, false, false, false], // Row 2
          [false, false, false, false], // Row 3
      ];
  
      // iterate over each cell in the input grid for template
      for (let row = 0; row < inputRows; row++) {
          for (let col = 0; col < inputCols; col++) {
              const startRow = row * 4;
              const startCol = col * 4;
  
              // apply 4x4 template to the newGrid and isTemplate
              for (let i = 0; i < 4; i++) {
                  for (let j = 0; j < 4; j++) {
                      isTemplate[startRow + i][startCol + j] = template[i][j];
                      newGrid[startRow+i][startCol+j] = template[i][j];
                  }
              }
          }
      }
      // iterate over each cell in the input grid 
      for (let row = 0; row < inputRows; row++) {
          for (let col = 0; col < inputCols; col++) {
              // create the inverseGrid
              inverseGrid[row][col] = !originalGrid[row][col];
          }
      }
      for (let row = 0; row < inputRows; row++) {
          for (let col = 0; col < inputCols; col++) {
              // create the mirrored inverse grid
              mirroredInverseGrid[row][col] = inverseGrid[row][inputCols - col - 1];
          }
      }
     
      // function to set FF and C2C2 based on input cell selection
      const selectFFandC2C2 = (startRow: number, startCol: number) => {
          newGrid[startRow + 3][startCol] = true;       // FF
          newGrid[startRow + 1][startCol + 2] = true;   // C2C2
      };
      
      // function to set C1C1 and BB based on input cell selection
      const selectC1C1andBB = (startRow: number, startCol: number) => {
          newGrid[startRow + 2][startCol + 1] = true;       // C1C1
          newGrid[startRow][startCol + 3] = true;   // BB
      };
  
      // iterate over each cell in the input grid
      for (let row = 0; row < inputRows; row++) {
          for (let col = 0; col < inputCols; col++) {
              if (originalGrid[row][col] === true) {
                  const startRow = row * 4;
                  const startCol = col * 4;
                  selectFFandC2C2(startRow, startCol);
              }
  
              if (mirroredInverseGrid[row][col] === true) {
                  const startRow = row * 4;
                  const startCol = col * 4;
                  selectC1C1andBB(startRow, startCol);
              }
          }
      }
  
      return { newGrid, isTemplate };
  };
  