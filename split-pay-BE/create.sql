CREATE TABLE Users(
  userID TEXT PRIMARY KEY NOT NULL,
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
  isLeader BOOLEAN,
  hasAcceptedTerms BOOLEAN NOT NULL,
  amountOwed FLOAT,
  FOREIGN KEY (groupID) REFERENCES Groups(groupID),
  FOREIGN KEY (memberID) REFERENCES Users(userID)
);