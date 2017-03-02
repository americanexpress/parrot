const fs = jest.genMockFromModule('fs');

fs.writeFile = jest.fn();
module.exports = fs;
