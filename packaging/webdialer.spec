Name:       WebDialer
Summary:    A HTML5 hands free dialer app
Version:    0.0.1
Release:    1
Group:      Applications/System
License:    Apache 2.0
URL:        http://www.tizen.org2
Source0:    %{name}-%{version}.tar.bz
Requires:   chromium
BuildRequires:  desktop-file-utils

%description
A HTML5 hands free dialer app

%prep
%setup -q -n %{name}-%{version}

%build

make %{?jobs:-j%jobs}

%install
rm -rf %{buildroot}
%make_install

desktop-file-install --delete-original       \
  --dir %{buildroot}%{_datadir}/applications             \
   %{buildroot}%{_datadir}/applications/*.desktop

%files
%defattr(-,root,root,-)
%{_datadir}/webdialer
%{_datadir}/applications/webdialer.desktop
%{_datadir}/pixmaps/icon.png
