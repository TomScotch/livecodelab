/* global describe, it */

var parser  = require('../../src/grammar/lcl');
var ast     = require('../../src/js/lcl/ast').Node;

var dedent = require('dentist').dedent;

var assert = require('assert');

describe('If', function () {

  it('simple if statement parses', function () {

    var program = dedent(`
                         a = 3

                         if (a == 3)
                         \tbox
                         `);
    var parsed = parser.parse(
      program, {
        functionNames: ['box'],
        inlibaleFunctions: ['box']
      });

    var expected = ast.Block([
      ast.Assignment('a', ast.Num(3)),
      ast.If(
        ast.BinaryOp('==', ast.Variable('a'), ast.Num(3)),
        ast.Block([
          ast.Application('box', [], null)
        ]),
        null
      )
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('if else statement parses', function () {

    var program = dedent(`
                         a = 3
                         if a == 3
                         \tbox
                         else
                         \tpeg
                         `);
    var parsed = parser.parse(
      program, {
        functionNames: ['box', 'peg'],
        inlinableFunctions: ['box', 'peg']
      });

    var expected = ast.Block([
      ast.Assignment('a', ast.Num(3)),
      ast.If(
        ast.BinaryOp('==', ast.Variable('a'), ast.Num(3)),
        ast.Block([
          ast.Application('box', [], null)
        ]),
        ast.If(
          ast.Num(1),
          ast.Block([
            ast.Application('peg', [], null)
          ])
        )
      )
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('if ifelse else statement parses', function () {

    var program = dedent(`
                         a = 3
                         if a == 1
                         \tbox
                         else if a == 2
                         \tball
                         else
                         \tpeg
                         `);
    var parsed = parser.parse(
      program, {
        functionNames: ['box', 'peg', 'ball'],
        inlinableFunctions: ['box', 'peg', 'ball']
      });

    var expected = ast.Block([
      ast.Assignment('a', ast.Num(3)),
      ast.If(
        ast.BinaryOp('==', ast.Variable('a'), ast.Num(1)),
        ast.Block([
          ast.Application('box', [], null)
        ]),
        ast.If(
          ast.BinaryOp('==', ast.Variable('a'), ast.Num(2)),
          ast.Block([
            ast.Application('ball', [], null)
          ]),
          ast.If(
            ast.Num(1),
            ast.Block([
              ast.Application('peg', [], null)
            ])
          )
        )
      )
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('if else statement parses inside a block', function () {

    var program = dedent(`
                         rotate
                         \tif 1
                         \t\tbox
                         \telse
                         \t\tpeg`);
    var parsed = parser.parse(
      program, {
        functionNames: ['box', 'peg', 'rotate'],
        inlinableFunctions: ['box', 'peg', 'rotate']
      });

    var expected = ast.Block([
      ast.Application('rotate', [], ast.Block([
        ast.If(
          ast.Num(1),
          ast.Block([
            ast.Application('box', [], null)
          ]),
          ast.If(
            ast.Num(1),
            ast.Block([
              ast.Application('peg', [], null)
            ])
          )
        )
      ]))
    ]);

    assert.deepEqual(parsed, expected);
  });


});

