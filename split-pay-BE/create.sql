CREATE TABLE Users(
  userID TEXT PRIMARY KEY NOT NULL,
  isLeader BOOLEAN NOT NULL,
  hasAcceptedTerms BOOLEAN NOT NULL,
  amountOwed FLOAT,
  userName TEXT,
  email TEXT,
);

CREATE TABLE Groups(
    groupID TEXT PRIMARY KEY NOT NULL,
    leaderID TEXT,
    groupName TEXT,
    hasEveryoneAcceptedTerms BOOLEAN,
    totalOwed FLOAT,
    isCurrent BOOLEAN
);

CREATE TABLE GroupMembers(
  groupID TEXT NOT NULL,
  memberID TEXT NOT NULL,
  FOREIGN KEY (groupID) REFERENCES Groups(groupID),
  FOREIGN KEY (memberID) REFERENCES Users(userID)
);