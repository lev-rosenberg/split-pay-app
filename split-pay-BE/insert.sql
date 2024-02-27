INSERT INTO Users(userID, hasAcceptedTerms, amountOwed, userName, email)
VALUES ('test_id', TRUE, TRUE, 0, 'test_name', 'example@gmail.com'); 


INSERT INTO GroupMembers(groupid, memberid, isleader) 
VALUES ('group1', '117562124164488705131', FALSE); 

INSERT INTO Groups (groupid, leaderid, groupname, haseveryoneacceptedterms, totalowed, iscurrent) 
VALUES ('group1', 'new-l', 'group-sung-not-leader', FALSE, 1200.0, TRUE); 

/* 
  postgresql rds endpoint: 
  final-project-396.czauaqw2uc55.us-east-2.rds.amazonaws.com
*/