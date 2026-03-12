export type TOperator =
  // Arithmetic Operators
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '^'

  // Comparison Operators
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='

  // Logical Operators
  | 'AND'
  | 'OR'
  | 'NOT'

  // String Operators
  | '||'
  | 'LIKE'
  | 'ILIKE'
  | 'SIMILAR TO'

  // Set Operators
  | 'IN'
  | 'NOT IN'
  | 'EXISTS'
  | 'ALL'
  | 'ANY'

  // Null Operators
  | 'IS NULL'
  | 'IS NOT NULL'

  // Bitwise Operators
  | '&'
  | '|'
  | '^'
  | '~'
  | '<<'
  | '>>'
  // Limit Clause
  | 'LIMIT';