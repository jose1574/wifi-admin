[Setup]
AppName=MiApp
AppVersion=1.0
DefaultDirName={pf64}\wifi-admin
DefaultGroupName=wifi-admin
OutputDir=dist
OutputBaseFilename=wifi-admin-v1.0-x64

[Files]
Source: "wifi-admin-win.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: ".env"; DestDir: "{app}"; Flags: ignoreversion; AfterInstall: AddToEnvFile
Source: "install\node-v20.18.1-x64.msi"; DestDir: "{tmp}"; Flags: ignoreversion

[Icons]
Name: "{group}\wifi-admin"; Filename: "{app}\wifi-admin-win.exe"
Name: "{userdesktop}\wifi-admin"; Filename: "{app}\wifi-admin-win.exe"

[Run]
Filename: "{tmp}\node-v20.18.1-x64.msi"; Parameters: "/quiet"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c cd /d {app} && npm install"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c cd /d {app} && node -v"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c cd /d {app} && npx pm2 -v"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c cd /d {app} && npx pm2 start wifi-admin-win.exe --name srv-wifi-admin"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c cd /d {app} && npx pm2 save"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c cd /d {app} && npx pm2 startup"; Flags: runhidden waituntilterminated

[UninstallRun]
Filename: "{cmd}"; Parameters: "/c npx pm2 stop srv-wifi-admin"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c npx pm2 delete srv-wifi-admin"; Flags: runhidden waituntilterminated
Filename: "{cmd}"; Parameters: "/c npx pm2 unstartup"; Flags: runhidden waituntilterminated

[Code]
var
  IPRouterPage: TInputQueryWizardPage;
  ExitCode: Integer;
  IPRouterValue: string;

procedure InitializeWizard();
begin
  // Crear una nueva página de consulta de entrada
  IPRouterPage := CreateInputQueryPage(wpWelcome,
    'Configuración de Variables de Entorno', 'Por favor, introduce la dirección IP del router:',
    'Escribe la dirección IP del router aquí.');
  // Añadir el campo de entrada
  IPRouterPage.Add('IP_ROUTER:', False);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
  begin
    IPRouterValue := IPRouterPage.Values[0];
  end;
end;


procedure ReplaceOrAddEnvVar(FileContents: TStringList; VarName, Value: string);
var
  i: Integer;
  Line: string;
begin
  for i := 0 to FileContents.Count - 1 do
  begin
    Line := FileContents[i];
    if Pos(VarName + '=', Line) = 1 then
    begin
      FileContents[i] := VarName + '=' + Value;
      Exit;
    end;
  end;
  FileContents.Add(VarName + '=' + Value);
end;

procedure AddToEnvFile();
var
  EnvFile: string;
  FileContents: TStringList;
begin
  EnvFile := ExpandConstant('{app}\.env');
  FileContents := TStringList.Create;
  try
    if FileExists(EnvFile) then
      FileContents.LoadFromFile(EnvFile);
    // Buscar y reemplazar la línea que contiene IP_ROUTER
    ReplaceOrAddEnvVar(FileContents, 'IP_ROUTER', IPRouterValue);
    FileContents.SaveToFile(EnvFile);
  finally
    FileContents.Free;
  end;
end;

