export type DBUser = {
  id: number,
  name: string,
  email: string,
  gId: string,
  u_role: 1 | 2
}

export type Book = {
  id: number,
  author: string,
  title: string,
  description: string,
  image: string
};

export type DBOperator =
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