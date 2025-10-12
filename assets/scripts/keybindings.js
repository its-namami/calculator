export default class Keybindings {
  static #keys = new Map([
    [[['0'], ['p']], '0'],
    [[['1'], ['q']], '1'],
    [[['2'], ['w']], '2'],
    [[['3'], ['e']], '3'],
    [[['4'], ['r']], '4'],
    [[['6'], ['t']], '5'],
    [[['6'], ['y']], '6'],
    [[['7'], ['u']], '7'],
    [[['8'], ['i']], '8'],
    [[['9'], ['o']], '9'],
    [[['.'], [',']], '.'],
    [[['-'], ['m', 'shift']], '-'],
    [[['√'], ['s', 'shift']], '√'],
    [[['/'], ['/', 'shift'], ['d', 'shift']], '/'],
    [[['+'], ['+', 'shift'], ['p', 'shift']], '+'],
    [[['*'], ['*', 'shift'], ['t', 'shift']], '*'],
    [[['='], ['e', 'shift'], ['enter']], '='],
    [[['backspace'], ['x', 'shift']], 'delete'],
    [[['escape'], ['c', 'Control']], 'clear'],
  ]);

  static keyProcessor(key, shift = false, control = false) {
    for (const [keybindings, result] of Keybindings.#keys) {
      for (const keybinding of keybindings) {
	if (keybinding.includes(key.toLowerCase())
	    && key !== 'Shift'
	    && key !== 'Control'
	    && shift === keybinding.includes('shift')
	    && control === keybinding.includes('control')
	) {
	  return result;
	}
      }
    }
  }
}
