
INSERT INTO G_SERVICES (TABLE_NAME,FIELDS,KEYS) VALUES ('G_SERVICES','*','TABLE_NAME');
INSERT INTO G_SERVICES (TABLE_NAME,FIELDS,KEYS) VALUES ('EMP','*','ID');
INSERT INTO G_SERVICES (TABLE_NAME,FIELDS,KEYS) VALUES ('DEP','*','ID');
INSERT INTO G_SERVICES (TABLE_NAME,FIELDS,KEYS,SELECT_VALUE) VALUES ('VIEW_EMP','*','ID',
	'SELECT E.*,D.NAME DEP_NAME FROM EMP E LEFT JOIN DEP D ON (E.ID_DEP=D.ID)');

INSERT INTO DEP (ID,NAME) VALUES ('1','VENTAS');
INSERT INTO DEP (ID,NAME) VALUES ('2','MARKETING');
INSERT INTO DEP (ID,NAME) VALUES ('3','DIRECCION');

INSERT INTO EMP (ID,NAME,ID_DEP) VALUES ('1','JOE','1');
INSERT INTO EMP (ID,NAME,ID_DEP) VALUES ('2','MARY','1');
INSERT INTO EMP (ID,NAME,ID_DEP) VALUES ('3','KEVIN','1');
INSERT INTO EMP (ID,NAME,ID_DEP) VALUES ('4','ANDREW','2');
INSERT INTO EMP (ID,NAME,ID_DEP) VALUES ('5','FRANK','2');
INSERT INTO EMP (ID,NAME,ID_DEP) VALUES ('6','BOSS','3');