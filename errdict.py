edict = {
'NameError:' : 'NameError usually happens when python can\'t find a variable. I see this the most when you misspell a variable name!',
'AssertionError:' : 'AssertionError usually happens when you use an \"assert statement, which fails.',
'AttributeError:' : 'AttributeError usually happens when you try to access an instance or class attribute that doesn\'t exist. If you did \"object.something\", check that something is spelled correctly!',
'IndexError:' : 'IndexError usually happens when you have a sequence like a list, and you try to do list[index], but index is out of range. Look for \"off-by-one\" errors, where in a loop, you increment the index one too many times.',
'KeyError:' : 'KeyError usually happens when you search for a key in a dictionary that doesn\'t exist. To avoid this error, use .get to provide a default value instead. As an example: dictionary.get("message", "notfound") would return notfound if it couldn\'t find message in the dictionary.',
'StopIteration:' : 'StopIteration usually happens when the built-in function next() signals the iterator doesn\'t have any more values left.',
'TypeError:' : 'TypeError usually happens when you try to apply some operation to an incorrect type. As an example, if bob = None, and I try bob(), it would throw a TypeError because it is trying to use the call operator on None. Print the variables you see on this line to double-check that they\'re the type you think they are.',
'UnboundLocalError:' : 'UnboundLocalError usually happens when you try to modify global variables. Say you have a global variable \"globalvar\", and inside a function, you try to do \"globalvar = globalvar + 1\". When you try to assign \"globalvar\" to something, python thinks it\'s a local variable. So, when you try to access \"globalvar\" in \"globalvar + 1\", it DOESN\'T access the global \"globalvar\", it tries to access a local \"globalvar\". Which doesn\'t exist, hence it is an unbound local variable. Look into \"nonlocal\" to see how to fix this error.',
'ZeroDivisionError:' : 'ZeroDivisionError usually happens when you try to divide by zero. Never good!',
}
#
# exception AssertionError
# Raised when an assert statement fails.
#
# exception AttributeError
# Raised when an attribute reference (see Attribute references) or assignment fails. (When an object does not support attribute references or attribute assignments at all, TypeError is raised.)
#
#
# exception IndexError
# Raised when a sequence subscript is out of range. (Slice indices are silently truncated to fall in the allowed range; if an index is not an integer, TypeError is raised.)
#
# exception KeyError
# Raised when a mapping (dictionary) key is not found in the set of existing keys.
#
# exception NameError
# Raised when a local or global name is not found. This applies only to unqualified names. The associated value is an error message that includes the name that could not be found.
#
# exception RecursionError
# This exception is derived from RuntimeError. It is raised when the interpreter detects that the maximum recursion depth (see sys.getrecursionlimit()) is exceeded.
#
#
# exception RuntimeError
# Raised when an error is detected that doesn’t fall in any of the other categories. The associated value is a string indicating what precisely went wrong.
#
# exception StopIteration
# Raised by built-in function next() and an iterator’s __next__() method to signal that there are no further items produced by the iterator.
#
# The exception object has a single attribute value, which is given as an argument when constructing the exception, and defaults to None.
#
# When a generator or coroutine function returns, a new StopIteration instance is raised, and the value returned by the function is used as the value parameter to the constructor of the exception.
#
# If a generator code directly or indirectly raises StopIteration, it is converted into a RuntimeError (retaining the StopIteration as the new exception’s cause).
#
#
# New in version 3.5.
#
# exception TypeError
# Raised when an operation or function is applied to an object of inappropriate type. The associated value is a string giving details about the type mismatch.
#
# This exception may be raised by user code to indicate that an attempted operation on an object is not supported, and is not meant to be. If an object is meant to support a given operation but has not yet provided an implementation, NotImplementedError is the proper exception to raise.
#
# Passing arguments of the wrong type (e.g. passing a list when an int is expected) should result in a TypeError, but passing arguments with the wrong value (e.g. a number outside expected boundaries) should result in a ValueError.
#
# exception UnboundLocalError
# Raised when a reference is made to a local variable in a function or method, but no value has been bound to that variable. This is a subclass of NameError.
#
# exception ValueError
# Raised when an operation or function receives an argument that has the right type but an inappropriate value, and the situation is not described by a more precise exception such as IndexError.
#
# exception ZeroDivisionError
# Raised when the second argument of a division or modulo operation is zero. The associated value is a string indicating the type of the operands and the operation.
