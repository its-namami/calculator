export default class Keybindings {
  static #keys = new Map([
    [[['0'], ['p']], '0'],
    [[['1'], ['q']], '1'],
    [[['2'], ['w']], '2'],
    [[['3'], ['e']], '3'],
    [[['4'], ['r']], '4'],
    [[['5'], ['t']], '5'],
    [[['6'], ['y']], '6'],
    [[['7'], ['u']], '7'],
    [[['8'], ['i']], '8'],
    [[['9'], ['o']], '9'],
    [[['.'], [',']], '.'],
    [[['-'], ['m', 'Shift']], '-'],
    [[['√'], ['s', 'Shift']], '√'],
    [[['/'], ['/', 'Shift'], ['d', 'Shift']], '/'],
    [[['+'], ['+', 'Shift'], ['p', 'Shift']], '+'],
    [[['*'], ['*', 'Shift'], ['t', 'Shift']], '*'],
    [[['='], ['e', 'Shift'], ['Enter']], '='],
    [[['Backspace'], ['x', 'Shift']], 'delete'],
    [[['Escape'], ['c', 'Control']], 'clear'],
  ]);

  static keyProcessor(key, shift = false, control = false) {
    for (const [keybindings, result] of Keybindings.#keys) {
      for (const keybinding of keybindings) {
	if (keybinding.includes(key.toLowerCase())
	    && key !== 'Shift'
	    && key !== 'Control'
	    && shift === keybinding.includes('Shift')
	    && control === keybinding.includes('Control')
	) {
	  return result;
	}
      }
    }
  }
}
